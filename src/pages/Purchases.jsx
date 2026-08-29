import { useState } from "react";
import { FiPlus } from "react-icons/fi";

import AddPurchaseModal from "../components/purchases/AddPurchaseModal";
import PurchaseTable from "../components/purchases/PurchaseTable";
import ViewPurchaseModal from "../components/purchases/ViewPurchaseModal";
import DeleteModal from "../components/common/DeleteModal";

function Purchases() {
    // ==============================
    // Suppliers
    // ==============================
    const [suppliers] = useState([
        {
            id: 1,
            supplierName: "Tech World",
        },
        {
            id: 2,
            supplierName: "Mobile Hub",
        },
    ]);

    // ==============================
    // Products
    // ==============================
    const [products] = useState([
        {
            id: 1,
            productName: "USB Cable",
            unit: "Piece",
            salePrice: 800,
            purchasePrice: 500,
        },
        {
            id: 2,
            productName: "Bluetooth Speaker",
            unit: "PC",
            salePrice: 800,
            purchasePrice: 300,
        },
    ]);

    // ==============================
    // Purchases
    // ==============================
    const [purchases, setPurchases] = useState([]);

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
    // Edit and update  Purchase
    // ==============================
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingPurchase, setEditingPurchase] = useState(null);
    // ==================================================

    // Open Edit Purchase Modal 
    // ==================================================
    const handleEdit = (purchaseData) => {
        setEditingPurchase(purchaseData)
        setIsModalOpen(true)
        setIsEditOpen(true)
    }

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
    };

    // ==================================================
    // Save Purchase
    // ==================================================
    const savePurchase = (purchaseData) => {
       
        if (isEditOpen) {
            setPurchases((prev) => {
              return prev.map((purchase) => purchase.id === editingPurchase.id ?
                    {
                        ...purchase, ...purchaseData
                    } : purchase
                )
            })
            setIsEditOpen(false)
            setEditingPurchase(null)
        }
        else {
            const newPurchase = {
                id: Date.now(),
                ...purchaseData,
            };

            setPurchases((prevPurchases) => [
                newPurchase,
                ...prevPurchases,
            ]);
        }


        setIsModalOpen(false);
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
    // Confirm Delete Purchase
    // ==================================================
    const confirmDeletePurchase = () => {
        if (!purchaseToDelete) return;

        setPurchases((prevPurchases) =>
            prevPurchases.filter(
                (purchase) =>
                    purchase.id !== purchaseToDelete.id
            )
        );

        setIsDeleteModalOpen(false);
        setPurchaseToDelete(null);
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
                PURCHASE TABLE
            ========================================== */}
            <PurchaseTable
                purchases={purchases}
                suppliers={suppliers}
                onView={handleViewPurchase}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />

            {/* ==========================================
                ADD PURCHASE MODAL
            ========================================== */}
            <AddPurchaseModal
                isOpen={isModalOpen}
                isEdit={isEditOpen}
                onClose={() => {
                    handleCloseAddModal;
                    setIsModalOpen(false);
                    setEditingPurchase(null);
                    setIsEditOpen(false);
                    handleCloseViewModal
                }}

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
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setPurchaseToDelete(null)
                    handleCloseDeleteModal
                }}
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
