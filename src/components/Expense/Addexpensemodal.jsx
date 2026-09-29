import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useAccounts } from "../../hooks/Useaccounts"; 

export const EXPENSE_CATEGORIES = [
  "Rent", "Utilities", "Salaries", "Transport", "Marketing",
  "Maintenance", "Office supplies", "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

export default function AddExpenseModal({ open, onClose, onSave, expense }) {
  // Expects useAccounts() to return { accounts } where each account has
  // { id, name, balance }. Rename the fields below if yours differ.
  const { accounts = [] } = useAccounts();

  const {
    register, handleSubmit, reset, watch, formState: { errors, isSubmitting },
  } = useForm();

  const selectedId = watch("accountId");

  useEffect(() => {
    if (!open) return;
    reset(
      expense ?? {
        date: today(), category: EXPENSE_CATEGORIES[0], description: "",
        amount: "", accountId: "", paidTo: "", note: "",
      }
    );
  }, [open, expense, reset]);

  if (!open) return null;

  // Balance available for this expense. When editing, the expense's own
  // amount is given back first if it is paid from the same account.
  const available = (accountId) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return 0;
    const refund = expense && expense.accountId === accountId ? Number(expense.amount) : 0;
    return Number(acc.currentBalance || 0) + refund;
  };
  const submit = async (data) => {
    const acc = accounts.find((a) => a.id === data.accountId);
    await onSave({ ...data, accountName: acc?.name || "" });
    onClose();
  };

  const field = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";
  const label = "mb-1 block text-sm font-medium text-gray-700";
  const err = "mt-1 text-xs text-red-600";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-lg bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">
            {expense ? `Edit ${expense.expenseNo}` : "Add expense"}
          </h2>
          <button onClick={onClose} aria-label="Close"><IoClose size={22} /></button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Date</label>
                <input type="date" className={field} {...register("date", { required: "Date is required" })} />
                {errors.date && <p className={err}>{errors.date.message}</p>}
              </div>
              <div>
                <label className={label}>Category</label>
                <select className={field} {...register("category", { required: true })}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={label}>Description</label>
              <input className={field} placeholder="e.g. Shop rent for October"
                {...register("description", { required: "Description is required" })} />
              {errors.description && <p className={err}>{errors.description.message}</p>}
            </div>

            <div>
              <label className={label}>Paid from account</label>
              <select className={field}
                {...register("accountId", { required: "Select an account" })}>
                <option value="">Select account</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} (balance: {Number(a.currentBalance || 0).toLocaleString()})
                  </option>
                ))}
              </select>
              {errors.accountId && <p className={err}>{errors.accountId.message}</p>}
            </div>

            <div>
              <label className={label}>Amount</label>
              <input type="number" step="0.01" className={field}
                {...register("amount", {
                  required: "Amount is required",
                  min: { value: 0.01, message: "Must be greater than 0" },
                  validate: (v) =>
                    !selectedId ||
                    Number(v) <= available(selectedId) ||
                    `Not enough balance (available: ${available(selectedId).toLocaleString()})`,
                })} />
              {errors.amount && <p className={err}>{errors.amount.message}</p>}
            </div>

            <div>
              <label className={label}>Paid to (optional)</label>
              <input className={field} {...register("paidTo")} />
            </div>

            <div>
              <label className={label}>Reference note (optional)</label>
              <textarea rows={2} className={field} {...register("note")} />
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t px-5 py-3">
            <button type="button" onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60">
              {expense ? "Save changes" : "Add expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}