import { useState, useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import SupplierTable from "../components/suppliers/SupplierTable";
import AddSupplierModal from "../components/suppliers/AddSupplierModal";
import DeleteModal from "../components/common/DeleteModal";


function Suppliers() {

    const initialSuppliers = [
        {
            id: 1,
            supplierName: "ABC Traders",
            contactPerson: "Ali Khan",
            phone: "+923001234567",
            address: "Peshawar",
        },
    ];
    const [suppliers, setSuppliers] = useState(initialSuppliers)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [supplierToDelete, setSupplierToDelete] = useState(null)

    //Delete
    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteSupplier = () => {
        setSuppliers((prev) =>
            prev.filter(
                (supplier) => supplier.id !== supplierToDelete.id
            )
        );

        setCurrentPage(1);

        setSupplierToDelete(null);

        setIsDeleteModalOpen(false);
    };

    // Pagination

    const [currentPage, setCurrentPage] = useState(1);

    const suppliersPerPage = 3;

    const totalPages = Math.ceil(
        suppliers.length / suppliersPerPage
    );

    const paginatedSuppliers = useMemo(() => {
        const startIndex =
            (currentPage - 1) * suppliersPerPage;

        return suppliers.slice(
            startIndex,
            startIndex + suppliersPerPage
        );
    }, [suppliers, currentPage]);

    //Edit supplier
    const handleEditSupplier = (supplier) => {
        setEditingSupplier(supplier)
        setIsModalOpen(true)
        setIsEditMode(true)
    }
    // Save data 
    const saveSupplier = (supplierData) => {

        if (isEditMode) {
            setSuppliers((prev) =>
                prev.map((supplier) =>
                    supplier.id === editingSupplier.id
                        ? {
                            ...supplier,
                            ...supplierData,
                        }
                        : supplier
                )
            );

            setIsEditMode(false);

            setEditingSupplier(null);
        }
        else {
            setSuppliers((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    ...supplierData,
                },
            ]);
        }

        setIsModalOpen(false);
    };


    return (

        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Suppliers
                    </h1>
                </div>

                <button
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     text-white px-5 py-3 rounded-xl transition"
                    onClick={() => setIsModalOpen(true)}>
                    <FiPlus />
                    Add Supplier
                </button>
            </div>
            <SupplierTable suppliers={paginatedSuppliers}
                onEditSupplier={handleEditSupplier}
                onDeleteSupplier={handleDelete}
                currentPage={currentPage}
                totalPages={totalPages}
                totalSuppliers={suppliers.length}
                suppliersPerPage={suppliersPerPage}
                onPageChange={setCurrentPage}
            />

            <AddSupplierModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setIsEditMode(false)
                }}
                onAddSupplier={saveSupplier}
                isEditMode={isEditMode}
                editingSupplier={editingSupplier} />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSupplierToDelete(null);
                }}
                onConfirm={confirmDeleteSupplier}
                title="Delete Supplier"
                message={`Are you sure you want to delete "${supplierToDelete?.supplierName}"?`}
            />
        </div>
    );
}


export default Suppliers