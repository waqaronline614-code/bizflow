import { useEffect } from "react";
import { useForm } from "react-hook-form";



function AddSupplierModal({ onClose, isOpen, onAddSupplier, isEditMode, editingSupplier }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

 useEffect(() => {
        if (isEditMode && editingSupplier) {
            reset(editingSupplier);
        }
        else {
            reset({
                supplierName: '',
            contactPerson: '',
            phone: '',
            address: '',
            });
        }
    }, [editingSupplier, isEditMode, reset]);


    if (!isOpen) return null;
    const onSubmit = (data) => {
        onAddSupplier({
            supplierName: data.supplierName,
            contactPerson: data.contactPerson,
            phone: data.phone,
            address: data.address,
        })
        reset();
        onClose();
    }
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div
                className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-800">
                        {
                            isEditMode ? "Edit supplier" : "Add Supplier"
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
                    className="flex-1 space-y-5 overflow-y-auto p-6"
                >
                    {/* Supplier Name */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Supplier Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter supplier name"
                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${errors.supplierName
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("supplierName", {
                                required: "Supplier name is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.supplierName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.supplierName.message}
                            </p>
                        )}
                    </div>

                    {/* Contact Person */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Contact Person
                        </label>

                        <input
                            type="text"
                            placeholder="Enter contact person"
                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${errors.contactPerson
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("contactPerson", {
                                required: "Contact person is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.contactPerson && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.contactPerson.message}
                            </p>
                        )}
                    </div>

                    {/* Phone */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            placeholder="+92 300 1234567"
                            className={`w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 ${errors.phone
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

                    {/* Address */}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Address
                        </label>

                        <textarea
                            rows="3"
                            placeholder="Enter supplier address"
                            className={`w-full resize-none rounded-xl border px-4 py-3 outline-none focus:ring-2 ${errors.address
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("address", {
                                required: "Address is required",
                            })}
                        />

                        {errors.address && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.address.message}
                            </p>
                        )}
                    </div>

                    {/* Footer */}

                    <div className="flex justify-end gap-4 border-t border-slate-200 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl bg-red-500 px-6 py-3 text-white transition hover:bg-red-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
                        >
                            {
                                isEditMode ? "Update Supplier" : "Save Supplier"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSupplierModal