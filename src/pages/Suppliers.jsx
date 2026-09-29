import { useState, useMemo, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

import SupplierTable from "../components/suppliers/SupplierTable";
import AddSupplierModal from "../components/suppliers/AddSupplierModal";
import DeleteModal from "../components/common/DeleteModal";

import {
    addSupplier,
    getSuppliers,
    updateSupplier,
    deleteSupplier,
    getAllSupplierBalances,
} from "../services/supplierService";

function Suppliers() {
    // -----------------------------
    // State
    // -----------------------------
    const [suppliers, setSuppliers] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    // -----------------------------
    // Pagination
    // -----------------------------
    const suppliersPerPage = 6;

    const totalPages = Math.max(
        1,
        Math.ceil(suppliers.length / suppliersPerPage)
    );

    const paginatedSuppliers = useMemo(() => {
        const startIndex =
            (currentPage - 1) * suppliersPerPage;

        return suppliers.slice(
            startIndex,
            startIndex + suppliersPerPage
        );
    }, [suppliers, currentPage]);

    // -----------------------------
    // Fetch Suppliers, enriched with computed balances
    // -----------------------------
    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);

            const data = await getSuppliers();
            const withBalances = await getAllSupplierBalances(
                Array.isArray(data) ? data : []
            );

            setSuppliers(withBalances);
        } catch (error) {
            console.error("Failed to fetch suppliers:", error);
            setSuppliers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // -----------------------------
    // Add Supplier Button
    // -----------------------------
    const handleAddSupplier = () => {
        setEditingSupplier(null);
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    // -----------------------------
    // Edit Supplier
    // -----------------------------
    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    // -----------------------------
    // Close Supplier Modal
    // -----------------------------
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingSupplier(null);
    };

    // -----------------------------
    // Save Supplier — refetch (with fresh balances) after add/update
    // -----------------------------
    const saveSupplier = async (supplierData) => {
        try {
            if (isEditMode && editingSupplier) {
                await updateSupplier(
                    editingSupplier.id,
                    supplierData
                );
            } else {
                await addSupplier(supplierData);
                setCurrentPage(1);
            }

            await fetchSuppliers();

            handleCloseModal();
        } catch (error) {
            console.error("Failed to save supplier:", error);
        }
    };

    // -----------------------------
    // Open Delete Modal
    // -----------------------------
    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteModalOpen(true);
    };

    // -----------------------------
    // Close Delete Modal
    // -----------------------------
    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSupplierToDelete(null);
    };

    // -----------------------------
    // Confirm Delete
    // -----------------------------
    const confirmDeleteSupplier = async () => {
        if (!supplierToDelete?.id) {
            return;
        }

        try {
            await deleteSupplier(supplierToDelete.id);

            setSuppliers((prev) =>
                prev.filter(
                    (supplier) =>
                        supplier.id !== supplierToDelete.id
                )
            );

            setCurrentPage(1);
        } catch (error) {
            console.error(
                "Failed to delete supplier:",
                error
            );
        } finally {
            handleCloseDeleteModal();
        }
    };

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Suppliers
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Manage your suppliers
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleAddSupplier}
                    className="
                        mt-4 md:mt-0
                        flex items-center justify-center gap-2
                        bg-blue-600 hover:bg-blue-700
                        text-white
                        px-5 py-3
                        rounded-xl
                        transition
                    "
                >
                    <FiPlus size={18} />
                    Add Supplier
                </button>
            </div>

            {/* Supplier Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <p className="text-red-500">
                        Loading suppliers.......
                    </p>
                </div>
            ) : (
                <SupplierTable
                    suppliers={paginatedSuppliers}
                    onEditSupplier={handleEditSupplier}
                    onDeleteSupplier={handleDelete}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalSuppliers={suppliers.length}
                    suppliersPerPage={suppliersPerPage}
                    onPageChange={setCurrentPage}
                />
            )}

            {/* Add / Edit Supplier Modal */}
            <AddSupplierModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddSupplier={saveSupplier}
                isEditMode={isEditMode}
                editingSupplier={editingSupplier}
            />

            {/* Delete Confirmation Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={confirmDeleteSupplier}
                title="Delete Supplier"
                message={
                    supplierToDelete
                        ? `Are you sure you want to delete "${supplierToDelete.supplierName}"?`
                        : "Are you sure you want to delete this supplier?"
                }
            />
        </div>
    );
}

export default Suppliers;