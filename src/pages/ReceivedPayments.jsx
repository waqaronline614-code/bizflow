import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import ReceivedPaymentsTable from "../components/salesPayments/ReceivedPaymentsTable";
import AddReceivedPaymentModal from "../components/salesPayments/AddReceivedPaymentsModal";
import PaymentViewModal from "../components/salesPayments/PaymentViewModal";
import DeleteModal from "../components/common/DeleteModal";
import { useOrders } from "../hooks/useOrders";
import { useCustomers } from "../hooks/useCustomer";
import { usePayments } from "../hooks/usePayments";
import { useAccounts } from "../hooks/Useaccounts";
import { addPayment, updatePayment, deletePayment } from "../services/paymentsService";
import { adjustAccountBalance } from "../services/Accountsservice";

function ReceivedPayments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);

  const { allOrders: orders, refetchOrders } = useOrders();
  const { customers } = useCustomers();
  const { payments, isLoading, error, refetch } = usePayments("received");
  const { accounts, applyLocalDelta } = useAccounts();

  const findAccountByName = (name) => accounts.find((a) => a.name === name);

  // --------------------------------
  // Add
  // --------------------------------
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingPayment(null);
  };

  // --------------------------------
  // Save (called by AddReceivedPaymentModal's onSubmit) — handles both
  // creating a new payment and updating an existing one
  // --------------------------------
  const saveData = async (payload) => {
    try {
      setSaveError(null);

      // capture the OLD amount/account before overwriting, so we can
      // reverse its balance effect on an edit
      const oldAccount = isEditing && editingPayment
        ? findAccountByName(editingPayment.method)
        : null;
      const oldAmount = isEditing && editingPayment
        ? Number(editingPayment.amount) || 0
        : 0;

      if (isEditing && editingPayment) {
        await updatePayment(editingPayment.id, {
          amount: payload.amount,
          method: payload.method,
          date: payload.date,
          reference: payload.reference,
        });
      } else {
        await addPayment(payload);
      }

      // --------------------------------
      // Balance sync: a received payment is money IN.
      // Reverse the old payment's effect (subtract it back out), then
      // apply the new one (add it). On a fresh add, oldAccount is null
      // so only the new credit applies.
      // --------------------------------
      const newAccount = findAccountByName(payload.method);
      const newAmount = Number(payload.amount) || 0;

      if (oldAccount && oldAmount > 0) {
        await adjustAccountBalance(oldAccount.id, -oldAmount);
        applyLocalDelta(oldAccount.id, -oldAmount);
      }
      if (newAccount && newAmount > 0) {
        await adjustAccountBalance(newAccount.id, newAmount);
        applyLocalDelta(newAccount.id, newAmount);
      }

      await refetch();

      const touchesOrder =
        payload.relatedType === "order" ||
        (isEditing && editingPayment?.relatedType === "order");
      if (touchesOrder) {
        await refetchOrders();
      }
    } catch (err) {
      console.error("Failed to save payment:", err);
      setSaveError("Failed to save payment. Please try again.");
    }
  };

  // --------------------------------
  // Edit
  // --------------------------------
  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // --------------------------------
  // View
  // --------------------------------
  const handleViewPayment = (payment) => {
    setViewingPayment(payment);
    setIsViewModalOpen(true);
  };

  // --------------------------------
  // Delete
  // --------------------------------
  const handleDeletePayment = (payment) => {
    setPaymentToDelete(payment);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePayment = async () => {
    try {
      setSaveError(null);

      // deleting a received payment reverses its credit -- debit the account back
      const deletedAccount = findAccountByName(paymentToDelete.method);
      const deletedAmount = Number(paymentToDelete.amount) || 0;

      await deletePayment(paymentToDelete.id);

      if (deletedAccount && deletedAmount > 0) {
        await adjustAccountBalance(deletedAccount.id, -deletedAmount);
        applyLocalDelta(deletedAccount.id, -deletedAmount);
      }

      await refetch();

      if (paymentToDelete.relatedType === "order") {
        await refetchOrders();
      }
    } catch (err) {
      console.error("Failed to delete payment:", err);
      setSaveError("Failed to delete payment. Please try again.");
    } finally {
      setPaymentToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // --------------------------------
  // Summary stats — derived from the real payments list
  // --------------------------------
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let receivedThisMonth = 0;
    let onAccount = 0;

    payments.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      if (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      ) {
        receivedThisMonth += payment.amount || 0;
      }

      if (!payment.relatedId) {
        onAccount += payment.amount || 0;
      }
    });

    return {
      receivedThisMonth,
      paymentsRecorded: payments.length,
      onAccount,
    };
  }, [payments]);

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Payments received
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Payments received from customers against orders or on account
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600
         hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
        >
          <FiPlus className="h-4 w-4" />
          Record payment
        </button>
      </div>

      {/* Summary strip */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Received this month
          </p>
          <p className="mt-1.5 text-lg font-semibold text-slate-800">
            Rs {summary.receivedThisMonth.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Payments recorded
          </p>
          <p className="mt-1.5 text-lg font-semibold text-slate-800">
            {summary.paymentsRecorded}
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            On account (unapplied)
          </p>
          <p className="mt-1.5 text-lg font-semibold text-slate-800">
            Rs {summary.onAccount.toLocaleString()}
          </p>
        </div>
      </div>

      {(error || saveError) && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {saveError || error}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <p className="text-red-500 flex justify-center items-center">Loading...</p>
      ) : (
        <ReceivedPaymentsTable
          payments={payments}
          customers={customers}
          orders={orders}
          onView={handleViewPayment}
          onEdit={handleEditPayment}
          onDelete={handleDeletePayment}
        />
      )}

      {/* Add / Edit modal */}
      <AddReceivedPaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseAddModal}
        orders={orders}
        customers={customers}
        onSave={saveData}
        isEdit={isEditing}
        editingPayment={editingPayment}
      />

      {/* View modal */}
      <PaymentViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingPayment(null);
        }}
        payment={viewingPayment}
        customers={customers}
        orders={orders}
      />

      {/* Delete confirmation */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPaymentToDelete(null);
        }}
        onConfirm={confirmDeletePayment}
        title="Delete Payment"
        message={`Are you sure you want to delete payment "${paymentToDelete?.paymentNo || `#${paymentToDelete?.id}`}"? This will also update the linked order's balance.`}
      />
    </div>
  );
}

export default ReceivedPayments;