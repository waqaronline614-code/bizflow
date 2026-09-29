import { FiPlus } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";

import CustomerTable from "../components/customers/CustomerTable";
import AddCustomerModal from "../components/customers/AddCustomerModal";
import DeleteModal from "../components/common/DeleteModal";
import {
  addCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getAllCustomerBalances,
} from "../services/customerService";

function Customers() {

  const [customers, setCustomers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  // Pagination

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 6;

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

  // --------------------------------
  // Fetch customers, then enrich with their computed balances
  // --------------------------------
  const fetchCustomer = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      const withBalances = await getAllCustomerBalances(data);
      setCustomers(withBalances);
    }
    catch (error) {
      console.error("Failed to fetch customer:", error)
      setCustomers([])
    }
    finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomer();
  }, [])

  // Delete

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCustomer = async () => {

    if (!customerToDelete?.id) {
      return;
    }
    try {
      await deleteCustomer(customerToDelete.id)
      setCustomers((prev) =>
        prev.filter(
          (customer) => customer.id !== customerToDelete.id
        )
      );

      setCurrentPage(1);

      setCustomerToDelete(null);
    }
    catch (error) {
      console.error(
        "Failed to delete supplier:",
        error
      );
    }
    finally {

      setIsDeleteModalOpen(false);
    }

  };

  // Edit

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);

    setIsEditMode(true);

    setIsModalOpen(true);
  };

  // --------------------------------
  // Save — re-fetch (with fresh balances) after add/update instead of
  // patching local state, since balance can't be computed client-side here
  // --------------------------------
  const saveCustomer = async (customerData) => {
    try {
      if (isEditMode) {
        await updateCustomer(editingCustomer.id, customerData)
      } else {
        await addCustomer(customerData)
        setCurrentPage(1);
      }

      await fetchCustomer();

      setIsEditMode(false);
      setEditingCustomer(null);
    }
    catch (error) {
      console.error("Failed to save customer:", error);
    }
    finally {

      setIsModalOpen(false);
    }
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
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600
           hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
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
      {
        isLoading ? (
          <p className="text-red-500 flex justify-center">Loading...</p>) :
          (
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
          )
      }

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