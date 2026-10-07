import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

function AddAccountModal({ isOpen, onClose, onAddAccount, editingAccount, isEditMode }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", type: "cash", openingBalance: 0 },
  });

  useEffect(() => {
    if (isEditMode && editingAccount) {
      reset({
        name: editingAccount.name,
        type: editingAccount.type,
        openingBalance: editingAccount.openingBalance,
      });
    } else {
      reset({ name: "", type: "cash", openingBalance: 0 });
    }
  }, [isEditMode, editingAccount, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    await onAddAccount({
      ...data,
      openingBalance: Number(data.openingBalance),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Edit Account" : "Add Account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account name</label>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="e.g. Cash in Hand, Bank - Meezan"
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              {...register("type")}
              className="w-full border rounded-xl px-3 py-2 text-sm"
            >
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Opening balance</label>
            <input
              type="number"
              step="0.01"
              disabled={isEditMode}
              {...register("openingBalance", { valueAsNumber: true })}
              className="w-full border rounded-xl px-3 py-2 text-sm disabled:bg-gray-100"
            />
            {isEditMode ? (
              <p className="text-xs text-gray-400 mt-1">
                Opening balance can't be changed after creation — record an owner capital entry instead to adjust the balance.
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Leave as 0 if you'd rather record this as an owner capital entry instead (recommended).
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 text-sm font-medium transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Update Account" : "Add Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAccountModal;