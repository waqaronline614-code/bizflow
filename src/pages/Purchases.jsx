import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import AddPurchaseModal from "../components/purchases/AddPurchaseModal";
import PurchaseTable from "../components/purchases/PurchaseTable";
import ViewPurchaseModal from "../components/purchases/ViewPurchaseModal";
import DeleteModal from "../components/common/DeleteModal";

import { useProducts } from "../hooks/useProducts";
import { usePurchases } from "../hooks/usePurchases";
import { useAccounts } from "../hooks/Useaccounts";
import {
    addPurchase,
    updatePurchase,
    deletePurchase,
} from "../services/purchaseService";
import { getSuppliers } from "../services/supplierService";
import {
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentsByRelated,
} from "../services/paymentsService";
import { adjustAccountBalance } from "../services/Accountsservice";


function Purchases() {
    // ==============================
    // Data (via hooks)
    // ==============================
    const { products, setProducts, refetch: refetchProducts } = useProducts();
    const {
        purchases,
        setPurchases,
        isLoading,
        error: fetchError,
    } = usePurchases();
    const { accounts, applyLocalDelta } = useAccounts();

    const [saveError, setSaveError] = useState(null);

    // ==============================
    // Suppliers (kept simple, low churn)
    // ==============================
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getSuppliers();
                setSuppliers(data);
            } catch (err) {
                console.error("Failed to fetch Suppliers:", err);
                setSaveError("Failed to load Suppliers. Please try again.");
            }
        };
        fetchSuppliers();
    }, []);

    // ==============================
    // Add Purchase Modal
    // ==============================
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ==============================
    // View Purchase
    // ==============================
    const [viewingPurchase, setViewingPurchase] = useState(null);

    // ==============================
    // Delete Purchase
    // ==============================
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [purchaseToDelete, setPurchaseToDelete] = useState(null);

    // ==============================
    // Edit and update Purchase
    // ==============================
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState(null);

    // Helper: the modal's "Paid From" select stores the account NAME
    const findAccountByName = (name) => accounts.find((a) => a.name === name);

    // ==================================================
    // Open Edit Purchase Modal
    // ==================================================
    const handleEdit = (purchaseData) => {
        setEditingPurchase(purchaseData);
        setIsModalOpen(true);
        setIsEditOpen(true);
    };

    // ==================================================
    // Open Add Purchase Modal
    // ==================================================
    const handleOpenAddModal = () => {
        setIsModalOpen(true);
    };

    // ==================================================
    // Close Add Purchase Modal
    // ==================================================
    const handleCloseAddModal = () => {
        setIsModalOpen(false);
        setEditingPurchase(null);
        setIsEditOpen(false);
    };

    // ==================================================
    // Save Purchase (Add or Update in Firestore)
    // ==================================================
    const savePurchase = async (purchaseData) => {
        try {
            const amountPaid = Number(purchaseData.amountPaid) || 0;
            let purchaseId;

            if (isEditOpen && editingPurchase) {
                purchaseId = editingPurchase.id;

                // pass the purchase's OLD items so purchaseService can reverse
                // the old purchase's stock impact before applying the new one
                await updatePurchase(editingPurchase.id, purchaseData, editingPurchase.items);

                setPurchases((prev) =>
                    prev.map((purchase) =>
                        purchase.id === editingPurchase.id
                            ? { ...purchase, ...purchaseData }
                            : purchase
                    )
                );

                setIsEditOpen(false);
                setEditingPurchase(null);
            } else {
                const { id, purchaseNo } = await addPurchase(purchaseData);
                purchaseId = id;

                setPurchases((prevPurchases) => [
                    { id, purchaseNo, ...purchaseData },
                    ...prevPurchases,
                ]);
            }

            // --------------------------------
            // Keep the linked payment in sync with "Amount Paid" on the form.
            // --------------------------------
            const existingPayments = await getPaymentsByRelated(purchaseId, "purchase");
            const existingPayment = existingPayments[0];

            // capture the OLD payment's account + amount before overwriting,
            // so we can reverse its balance effect
            const oldAccount = existingPayment ? findAccountByName(existingPayment.method) : null;
            const oldAmount = existingPayment ? Number(existingPayment.amount) || 0 : 0;

            const newAccount = purchaseData.paymentMethod
                ? findAccountByName(purchaseData.paymentMethod)
                : null;

            if (existingPayment) {
                if (amountPaid > 0) {
                    await updatePayment(existingPayment.id, {
                        amount: amountPaid,
                        date: purchaseData.purchaseDate,
                        method: purchaseData.paymentMethod || "Cash",
                        reference: purchaseData.referenceNote || "",
                    });
                }
                // if amountPaid is 0 on an edit, we leave the existing payment
                // alone rather than deleting it -- delete it from Make Payments
                // directly if that payment should be removed entirely
            } else if (amountPaid > 0) {
                await addPayment({
                    type: "made",
                    partyType: "supplier",
                    partyId: purchaseData.supplierId,
                    relatedType: "purchase",
                    relatedId: purchaseId,
                    amount: amountPaid,
                    date: purchaseData.purchaseDate,
                    method: purchaseData.paymentMethod || "Cash",
                    reference: purchaseData.referenceNote || "",
                });
            }

            // --------------------------------
            // Balance sync: a purchase payment is money OUT.
            // Reverse the old payment's effect (add it back), then apply
            // the new one (subtract it). On a fresh add, oldAccount is null
            // so only the new debit applies.
            // --------------------------------
            if (oldAccount && oldAmount > 0) {
                await adjustAccountBalance(oldAccount.id, oldAmount);
                applyLocalDelta(oldAccount.id, oldAmount);
            }
            if (newAccount && amountPaid > 0) {
                await adjustAccountBalance(newAccount.id, -amountPaid);
                applyLocalDelta(newAccount.id, -amountPaid);
            }

            // stock changed -- refresh products so the UI shows the latest numbers
            await refetchProducts();

            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save purchase:", err);
            setSaveError("Failed to save purchase. Please try again.");
        }
    };

    // ==================================================
    // View Purchase
    // ==================================================
    const handleViewPurchase = (purchase) => {
        if (!purchase) return;
        setViewingPurchase(purchase);
    };

    const handleCloseViewModal = () => {
        setViewingPurchase(null);
    };

    // ==================================================
    // Delete Purchase
    // ==================================================
    const handleDelete = (purchase) => {
        if (!purchase) return;
        setPurchaseToDelete(purchase);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPurchaseToDelete(null);
    };

    const confirmDeletePurchase = async () => {
        if (!purchaseToDelete) return;

        try {
            // pass the purchase's items so stock can be reversed
            await deletePurchase(purchaseToDelete.id, purchaseToDelete.items);

            // --------------------------------
            // Reverse any linked payment's effect on the account balance,
            // then delete the payment record itself.
            // --------------------------------
            const linkedPayments = await getPaymentsByRelated(purchaseToDelete.id, "purchase");
            const linkedPayment = linkedPayments[0];

            if (linkedPayment) {
                const linkedAccount = findAccountByName(linkedPayment.method);
                const linkedAmount = Number(linkedPayment.amount) || 0;

                if (linkedAccount && linkedAmount > 0) {
                    await adjustAccountBalance(linkedAccount.id, linkedAmount);
                    applyLocalDelta(linkedAccount.id, linkedAmount);
                }

                await deletePayment(linkedPayment.id);
            }

            setPurchases((prevPurchases) =>
                prevPurchases.filter(
                    (purchase) => purchase.id !== purchaseToDelete.id
                )
            );

            // refresh products so the UI shows the restored stock
            await refetchProducts();

            setIsDeleteModalOpen(false);
            setPurchaseToDelete(null);
        } catch (err) {
            console.error("Failed to delete purchase:", err);
            setSaveError("Failed to delete purchase. Please try again.");
        }
    };

    // ==================================================
    // Find Supplier For Viewed Purchase
    // ==================================================
    const viewingSupplier = viewingPurchase
        ? suppliers.find(
            (supplier) =>
                supplier.id.toString() ===
                viewingPurchase.supplierId?.toString()
        )
        : null;

    const deletingSupplier = purchaseToDelete
        ? suppliers.find(
            (supplier) =>
                supplier.id.toString() ===
                purchaseToDelete.supplierId?.toString()
        )
        : null;

    const error = fetchError || saveError;

    return (
        <div className="w-full">
            {/* ==========================================
                PAGE HEADER
            ========================================== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6 lg:mb-8">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Purchases
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage your product purchases and stock.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenAddModal}
                    className="
                        w-full md:w-auto
                        flex items-center justify-center gap-2
                        bg-blue-600
                        hover:bg-blue-700
                        active:bg-blue-800
                        text-white
                        px-5 py-2.5 lg:py-3
                        rounded-xl
                        transition
                        duration-200
                        shadow-sm
                    "
                >
                    <FiPlus size={18} />
                    <span>Add Purchase</span>
                </button>
            </div>

            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-sm text-slate-500 py-8 text-center">
                    Loading purchases...
                </div>
            ) : (
                <PurchaseTable
                    purchases={purchases}
                    suppliers={suppliers}
                    onView={handleViewPurchase}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}

            <AddPurchaseModal
                isOpen={isModalOpen}
                isEdit={isEditOpen}
                onClose={handleCloseAddModal}
                suppliers={suppliers}
                products={products}
                onAddPurchase={savePurchase}
                editingPurchase={editingPurchase}
            />

            {viewingPurchase && (
                <ViewPurchaseModal
                    purchase={viewingPurchase}
                    supplier={viewingSupplier}
                    onClose={handleCloseViewModal}
                />
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDeletePurchase}
                title="Delete Purchase"
                message={
                    deletingSupplier
                        ? `Are you sure you want to delete this Supplier from "${deletingSupplier.supplierName}"?`
                        : "Are you sure you want to delete this supplier?"
                }
            />
        </div>
    );
}

export default Purchases;