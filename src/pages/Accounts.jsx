import { FiPlus } from "react-icons/fi";
import { useMemo, useState } from "react";

import AccountTable from "../components/accounts/Accounttable";
import AddAccountModal from "../components/accounts/AddAccountModal";
import DeleteModal from "../components/common/DeleteModal";
import { useAccounts } from "../hooks/Useaccounts";
import {
  addAccount,
  updateAccount,
  deleteAccount,
} from "../services/Accountsservice";

function Accounts() {
  // Live data: updates by itself whenever an account changes in Firestore
  // (expenses, payments, capital, edits, deletes)
  const { accounts, loading: isLoading } = useAccounts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 6;
  const totalPages = Math.ceil(accounts.length / accountsPerPage);

  const paginatedAccounts = useMemo(() => {
    const startIndex = (currentPage - 1) * accountsPerPage;
    return accounts.slice(startIndex, startIndex + accountsPerPage);
  }, [accounts, currentPage]);

  // Delete
  const handleDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete?.id) return;
    try {
      await deleteAccount(accountToDelete.id);
      setCurrentPage(1);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  // Edit
  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Save — no manual re-fetch needed, the live listener picks up the change
  const saveAccount = async (accountData) => {
    try {
      if (isEditMode) {
        await updateAccount(editingAccount.id, accountData);
      } else {
        await addAccount(accountData);
        setCurrentPage(1);
      }
      setIsEditMode(false);
      setEditingAccount(null);
    } catch (error) {
      console.error("Failed to save account:", error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Accounts</h1>
        </div>

        <button
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600
           hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition"
          onClick={() => {
            setEditingAccount(null);
            setIsEditMode(false);
            setIsModalOpen(true);
          }}
        >
          <FiPlus />
          Add Account
        </button>
      </div>

      {isLoading ? (
        <p className="text-red-500 flex justify-center">Loading...</p>
      ) : (
        <AccountTable
          accounts={paginatedAccounts}
          onEditAccount={handleEditAccount}
          onDeleteAccount={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          totalAccounts={accounts.length}
          accountsPerPage={accountsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAccount(null);
          setIsEditMode(false);
        }}
        onAddAccount={saveAccount}
        editingAccount={editingAccount}
        isEditMode={isEditMode}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={confirmDeleteAccount}
        title="Delete Account"
        message={`Are you sure you want to delete "${accountToDelete?.name}"? ${accountToDelete?.currentBalance ? "It still has a non-zero balance." : ""}`}
      />
    </div>
  );
}

export default Accounts;