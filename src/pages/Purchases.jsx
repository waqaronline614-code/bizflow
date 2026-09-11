import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import AddPurchaseModal from "../components/purchases/AddPurchaseModal";
import PurchaseTable from "../components/purchases/PurchaseTable";
import ViewPurchaseModal from "../components/purchases/ViewPurchaseModal";
import DeleteModal from "../components/common/DeleteModal";

import { useProducts } from "../hooks/useProducts";
import { usePurchases } from "../hooks/usePurchases";
import {
    addPurchase,
    updatePurchase,
    deletePurchase,
} from "../services/purchaseService";
import { getSuppliers } from "../services/supplierService";


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
            if (isEditOpen && editingPurchase) {
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

                setPurchases((prevPurchases) => [
                    { id, purchaseNo, ...purchaseData },
                    ...prevPurchases,
                ]);
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