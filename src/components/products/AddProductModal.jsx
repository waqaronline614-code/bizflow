import { useEffect } from "react";
import { useForm } from "react-hook-form";

function AddProductModal({ isOpen, onClose, onAddProduct, editingProduct, isEditMode }) {


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (isEditMode && editingProduct) {
            reset(editingProduct);
        }
        else {
            reset({
                productName: "",
                category: "",
                supplier: "",
                purchasePrice: "",
                sellingPrice: "",
                stock: "",
                status: "",
            });
        }
    }, [editingProduct, isEditMode, reset]);

    if (!isOpen) return null;

    const onSubmit = (data) => {
        const stock = Number(data.stock);

        onAddProduct({
            productName: data.productName,
            category: data.category,
            supplier: data.supplier,
            purchasePrice: Number(data.purchasePrice),
            sellingPrice: Number(data.sellingPrice),
            stock,
            status: stock > 0 ? "In Stock" : "Out of Stock",
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
                            isEditMode ? "Edit Product" : "Add Product"
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
                    {/* Product Name */}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Product Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter product name"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.productName
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("productName", {
                                required: "Product name is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.productName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.productName.message}
                            </p>
                        )}
                    </div>

                    {/* Category */}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Category
                        </label>

                        <input
                            type="text"
                            placeholder="Category is required"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.category
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("category", {
                                required: "Category name is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.category && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    {/*Supplier*/}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Supplier
                        </label>

                        <input
                            type="text"
                            placeholder="Supplier is required"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.supplier
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("supplier", {
                                required: "supplier is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters",
                                },
                            })}
                        />

                        {errors.supplier && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.supplier.message}
                            </p>
                        )}
                    </div>

                    {/*purchasePrice*/}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Purchase Price
                        </label>

                        <input
                            type="number"
                            placeholder="Enter Purchase Price"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.purchasePrice
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("purchasePrice", {
                                required: "Purchase Price is required",
                                min: {
                                    value: 0,
                                    message: "Price cannot be negative",
                                },
                            })}
                        />

                        {errors.purchasePrice && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.purchasePrice.message}
                            </p>
                        )}
                    </div>
                    {/*sellingPrice*/}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Selling Price
                        </label>

                        <input
                            type="number"
                            placeholder="Enter Selling Price"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.sellingPrice
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("sellingPrice", {
                                required: "Selling Price is required",
                                min: {
                                    value: 0,
                                    message: "Price cannot be negative",
                                },
                            })}
                        />

                        {errors.sellingPrice && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.sellingPrice.message}
                            </p>
                        )}
                    </div>

                    {/*Stock*/}

                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-700">
                            Stock
                        </label>

                        <input
                            type="number"
                            placeholder="Enter Stock"
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2
              ${errors.stock
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-slate-300 focus:ring-blue-500"
                                }`}
                            {...register("stock", {
                                required: "Stock is required",
                                min: {
                                    value: 0,
                                    message: "Stock cannot be negative",
                                },
                            })}
                        />

                        {errors.stock && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.stock.message}
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
                            {isEditMode ? "Update Product" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;