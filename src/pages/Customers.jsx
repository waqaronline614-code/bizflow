import { FiPlus } from "react-icons/fi";
import { useMemo, useState } from "react";

import CustomerTable from "../components/customers/CustomerTable";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import DeleteModal from "../components/common/DeleteModal";

function Customers() {
  const initialCustomers = [
    {
      id: 1,
      fullName: "Ali Khan",
      phone: "+92 300 1234567",
      email: "ali@gmail.com",
      address: "Peshawar",
      status: "Active",
    },
  ];

  const [customers, setCustomers] = useState(initialCustomers);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 3;

  const totalPages = Math.ceil(
    customers.length / customersPerPage
  );

  const paginatedCustomers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * customersPerPage;

    return customers.slice(
      startIndex,
      startIndex + customersPerPage
    );
  }, [customers, currentPage]);

  // Delete

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = () => {
    setCustomers((prev) =>
      prev.filter(
        (customer) => customer.id !== customerToDelete.id
      )
    );

    setCurrentPage(1);

    setCustomerToDelete(null);

    setIsDeleteModalOpen(false);
  };

  // Edit

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setIsEditMode(true);

    setIsModalOpen(true);
  };

  // Save

  const saveCustomer = (customerData) => {
    if (isEditMode) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? {
              ...customer,
              ...customerData,
            }
            : customer
        )
      );

      setIsEditMode(false);

      setEditingCustomer(null);
    } else {
      setCustomers((prev) => [
        {
          id: Date.now(),
          ...customerData,
        },
        ...prev,
      ]);

      setCurrentPage(1);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Customers
          </h1>
        </div>

        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          onClick={() => {
            setEditingCustomer(null);
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />

          Add Customer
        </button>
      </div>

      <CustomerTable
        customers={paginatedCustomers}
        onEditCustomer={handleEditCustomer}
        onDeleteCustomer={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCustomers={customers.length}
        customersPerPage={customersPerPage}
        onPageChange={setCurrentPage}
      />

      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
          setIsEditMode(false);
        }}
        onAddCustomer={saveCustomer}
        editingCustomer={editingCustomer}
        isEditMode={isEditMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCustomerToDelete(null);
        }}
        onConfirm={confirmDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.fullName}"?`}
      />
    </div>
  );
}

export default Customers;