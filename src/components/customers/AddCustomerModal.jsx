import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AddCustomerModal({ isOpen, onClose, onAddCustomer, editingCustomer, isEditMode }) {


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isEditMode && editingCustomer) {
      reset(editingCustomer);
    }
    else {
      reset({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        status: "",
      });
    }
  }, [editingCustomer, isEditMode, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onAddCustomer({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      status: data.status
    });

    reset();
    onClose();
  };


  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            {
              isEditMode ? "Edit Customer" : "Add Customer"
            }
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-slate-400 hover:text-red-500 transition"
          >
            &times;
          </button>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Full Name */}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter customer name"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
                }`}
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters",
                },
              })}
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <input
              type="text"
              placeholder="+92 300 1234567"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
                }`}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(\+92|0)?3[0-9]{9}$/,
                  message: "Enter a valid Pakistani phone number",
                },
              })}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              placeholder="customer@gmail.com"
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
                }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              rows="3"
              placeholder="Enter address"
              className={`w-full px-4 py-3 rounded-xl border resize-none focus:outline-none focus:ring-2
              ${errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
                }`}
              {...register("address", {
                required: "Address is required",
              })}
            ></textarea>

            {errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Status */}

          <div>
            <label className="block mb-2 text-sm font-medium text-slate-700">
              Status
            </label>

            <select
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2
              ${errors.status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-300 focus:ring-blue-500"
                }`}
              {...register("status", {
                required: "Status is required",
              })}
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              {isEditMode ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomerModal;