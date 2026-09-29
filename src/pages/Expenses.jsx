import { useMemo, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import useExpenses from "../hooks/Useexpenses"
import AddExpenseModal, { EXPENSE_CATEGORIES } from "../components/Expense/Addexpensemodal"
import DeleteModal from "../components/common/DeleteModal";

export default function Expenses() {
  const { expenses, loading, error, create, update, remove } = useExpenses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [category, setCategory] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const filtered = useMemo(
    () => (category === "All" ? expenses : expenses.filter((e) => e.category === category)),
    [expenses, category]
  );
  const total = useMemo(() => filtered.reduce((s, e) => s + (e.amount || 0), 0), [filtered]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e); setModalOpen(true); };
  const handleSave = (data) => (editing ? update(editing.id, data) : create(data));

  // Delete — same flow as the Accounts page
  const handleDelete = (expense) => {
    setExpenseToDelete(expense);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete?.id) return;
    try {
      await remove(expenseToDelete.id);
      setExpenseToDelete(null);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <div className="flex items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm">
            <option>All</option>
            {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={openAdd}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
            <FiPlus /> Add expense
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm text-gray-600">
        {filtered.length} expenses · Total: <span className="font-semibold">{total.toLocaleString()}</span>
      </p>

      {error && (
        <p className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700">
          Couldn't load expenses. Check your Firestore rules for the "expenses" collection.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Paid from</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                No expenses yet. Click "Add expense" to record one.
              </td></tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{e.expenseNo}</td>
                  <td className="px-4 py-3">{e.date}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3">{e.description}</td>
                  <td className="px-4 py-3">{e.accountName || e.paymentMethod}</td>
                  <td className="px-4 py-3 text-right">{Number(e.amount).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      {/* Icon colors: swap these classes for the ones used in Accounttable.jsx if they differ */}
                      <button onClick={() => openEdit(e)} aria-label="Edit"
                        className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(e)} aria-label="Delete"
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal open={modalOpen} onClose={() => setModalOpen(false)}
        onSave={handleSave} expense={editing} />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={confirmDeleteExpense}
        title="Delete Expense"
        message={`Are you sure you want to delete ${expenseToDelete?.expenseNo}? The amount will be returned to ${expenseToDelete?.accountName || "the account"}.`}
      />
    </div>
  );
}