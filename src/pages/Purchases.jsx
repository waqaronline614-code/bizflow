import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import AddPurchaseModal from "../components/purchases/AddPurchaseModal";
import PurchaseTable from "../components/purchases/PurchaseTable";
import ViewPurchaseModal from "../components/purchases/ViewPurchaseModal";
import DeleteModal from "../components/common/DeleteModal";

import {
    addPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase,
} from "../services/purchaseService";
import {getSuppliers, } from "../services/supplierService"
import {getProducts } from "../services/productService"


function Purchases() {
    // ==============================
    // Suppliers
    // ==============================
    const [suppliers , setSuppliers] = useState([]);

    // ==============================
    // Products
    // ==============================
    const [products, setProducts] = useState([]);

    // ==============================
    // Purchases
    // ==============================
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
    // Fetch Purchases From Firestore On Mount
    // ==================================================
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setIsLoading(true);
                const data = await getPurchase();
                setPurchases(data);
            } catch (err) {
                console.error("Failed to fetch purchases:", err);
                setError("Failed to load purchases. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to load product. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        const fetchSuppliers = async () => {
            try {
                setIsLoading(true);
                const data = await getSuppliers();
                setSuppliers(data);
            } catch (err) {
                console.error("Failed to fetch Suppliers:", err);
                setError("Failed to load Suppliers. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSuppliers();
        fetchProducts();
        fetchPurchases();
    }, []);

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
                // Update existing purchase in Firestore
                await updatePurchase(editingPurchase.id, purchaseData);

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
                // Add new purchase to Firestore
                const newId = await addPurchase(purchaseData);

                const newPurchase = {
                    id: newId,
                    ...purchaseData,
                };

                setPurchases((prevPurchases) => [
                    newPurchase,
                    ...prevPurchases,
                ]);
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error("Failed to save purchase:", err);
            setError("Failed to save purchase. Please try again.");
        }
    };

    // ==================================================
    // View Purchase
    // ==================================================
    const handleViewPurchase = (purchase) => {
        if (!purchase) return;

        setViewingPurchase(purchase);
    };

    // ==================================================
    // Close View Modal
    // ==================================================
    const handleCloseViewModal = () => {
        setViewingPurchase(null);
    };

    // ==================================================
    // Open Delete Modal
    // ==================================================
    const handleDelete = (purchase) => {
        if (!purchase) return;

        setPurchaseToDelete(purchase);
        setIsDeleteModalOpen(true);
    };

    // ==================================================
    // Close Delete Modal
    // ==================================================
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setPurchaseToDelete(null);
    };

    // ==================================================
    // Confirm Delete Purchase (Delete From Firestore)
    // ==================================================
    const confirmDeletePurchase = async () => {
        if (!purchaseToDelete) return;

        try {
            await deletePurchase(purchaseToDelete.id);

            setPurchases((prevPurchases) =>
                prevPurchases.filter(
                    (purchase) => purchase.id !== purchaseToDelete.id
                )
            );

            setIsDeleteModalOpen(false);
            setPurchaseToDelete(null);
        } catch (err) {
            console.error("Failed to delete purchase:", err);
            setError("Failed to delete purchase. Please try again.");
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

    // ==================================================
    // Find Supplier For Delete Confirmation
    // ==================================================
    const deletingSupplier = purchaseToDelete
        ? suppliers.find(
            (supplier) =>
                supplier.id.toString() ===
                purchaseToDelete.supplierId?.toString()
        )
        : null;

    return (
        <div className="w-full">
            {/* ==========================================
                PAGE HEADER
            ========================================== */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6 lg:mb-8">
                {/* Title */}
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                        Purchases
                    </h1>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage your product purchases and stock.
                    </p>
                </div>

                {/* Add Purchase Button */}
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

            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}
            {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {/* ==========================================
                PURCHASE TABLE
            ========================================== */}
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

            {/* ==========================================
                ADD PURCHASE MODAL
            ========================================== */}
            <AddPurchaseModal
                isOpen={isModalOpen}
                isEdit={isEditOpen}
                onClose={handleCloseAddModal}
                suppliers={suppliers}
                products={products}
                onAddPurchase={savePurchase}
                editingPurchase={editingPurchase}
            />

            {/* ==========================================
                VIEW PURCHASE MODAL
            ========================================== */}
            {viewingPurchase && (
                <ViewPurchaseModal
                    purchase={viewingPurchase}
                    supplier={viewingSupplier}
                    onClose={handleCloseViewModal}
                />
            )}

            {/* ==========================================
                DELETE PURCHASE MODAL
            ========================================== */}
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