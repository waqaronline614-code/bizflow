import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import ItemsEditor from "../common/ItemsEditor";

function AddOrderModal({
    isOpen,
    onClose,
    customers,
    products,
    onAddOrder,
    isEdit,
    editingOrder,
}) {
    // =========================================================
    // MAIN FORM
    // =========================================================
    const {
        reset,
        register,
        handleSubmit,
        control,
        setError,
        setValue,
        watch,
        clearErrors: clearMainErrors,
        formState: { errors },
    } = useForm({
        defaultValues: {
            customerId: "",
            paymentStatus: "",
            orderDate: "",
            amountPaid: "",
            totalDiscount: 0,
            items: [],
        },
    });

    const { fields: items, append, remove, update } = useFieldArray({
        control,
        name: "items",
    });

    const amountPaidRaw = watch("amountPaid");
    const totalDiscountRaw = watch("totalDiscount");

    // =========================================================
    // LOAD EDITING ORDER
    // =========================================================
    useEffect(() => {
        if (isEdit && editingOrder) {
            reset({
                customerId: editingOrder.customerId || "",
                paymentStatus: editingOrder.paymentStatus || "",
                orderDate: editingOrder.orderDate || "",
                amountPaid: editingOrder.amountPaid || "",
                totalDiscount: editingOrder.totalDiscount || 0,
                items: editingOrder.items || [],
            });
        }
    }, [isEdit, editingOrder, reset]);

    // =========================================================
    // HELPERS
    // =========================================================
    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    // =========================================================
    // STOCK CALCULATION
    // =========================================================
    // When editing an existing saved order, the quantities in that order
    // were already subtracted from product.stock in the database. Add
    // them back here so the person can redistribute up to their original
    // total, not just whatever happens to be left in stock right now.
    const originalOrderQuantities = (() => {
        const map = {};
        if (isEdit && editingOrder?.items) {
            editingOrder.items.forEach((item) => {
                map[item.productId] =
                    (map[item.productId] || 0) + safeNum(item.quantity);
            });
        }
        return map;
    })();

    const getAvailableStock = (productId, excludeIndex = null) => {
        const product = products.find(
            (p) => String(p.id) === String(productId)
        );

        const currentStock = safeNum(product?.stock);
        const reserved = originalOrderQuantities[productId] || 0;

        const usedInOrder = items.reduce((sum, item, idx) => {
            if (idx === excludeIndex) return sum;
            if (String(item.productId) === String(productId)) {
                return sum + safeNum(item.quantity);
            }
            return sum;
        }, 0);

        return currentStock + reserved - usedInOrder;
    };

    // =========================================================
    // TOTALS
    // =========================================================
    const totalQuantity = items.reduce((total, item) => total + safeNum(item.quantity), 0);
    const gross = items.reduce((total, item) => total + safeNum(item.amount), 0);

    const discountPercent = safeNum(totalDiscountRaw);
    const discountAmount = gross * (discountPercent / 100);
    const netAmount = gross - discountAmount;

    const amountPaid = safeNum(amountPaidRaw);
    const balance = netAmount - amountPaid;

    // =========================================================
    // PAYMENT STATUS
    // =========================================================
    const paymentStatus =
        netAmount <= 0
            ? "unpaid"
            : amountPaid <= 0
                ? "unpaid"
                : amountPaid >= netAmount
                    ? "paid"
                    : "partial";

    useEffect(() => {
        setValue("paymentStatus", paymentStatus);
    }, [paymentStatus, setValue]);

    // =========================================================
    // FINAL SUBMIT
    // =========================================================
    const onSubmit = (data) => {
        if (items.length === 0) {
            setError("items", {
                type: "manual",
                message: "Add at least one product",
            });
            return;
        }

        const orderData = { ...data, paymentStatus, items };
        onAddOrder(orderData);

        reset({
            customerId: "",
            paymentStatus: "",
            orderDate: "",
            amountPaid: "",
            totalDiscount: 0,
            items: [],
        });

        onClose();
    };

    const handleCancel = () => {
        reset({
            customerId: "",
            paymentStatus: "",
            orderDate: "",
            amountPaid: "",
            totalDiscount: 0,
            items: [],
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {isEdit ? "Update Order" : "Add Order"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEdit ? "Update an Order" : "Create an Order"}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition mb-7"
                    >
                        &times;
                    </button>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 overflow-y-auto">

                    {/* CUSTOMER + DATE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Customer
                            </label>
                            <select
                                {...register("customerId", { required: "Customer is required" })}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.fullName}
                                    </option>
                                ))}
                            </select>
                            {errors.customerId && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.customerId.message}
                                </p>
                            )}
                        </div>

                        <input type="hidden" {...register("paymentStatus")} />

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Order Date
                            </label>
                            <input
                                type="date"
                                {...register("orderDate", { required: "Order date is required" })}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.orderDate && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.orderDate.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ================= ITEM TABLE (shared component) ================= */}
                    <ItemsEditor
                        items={items}
                        products={products}
                        append={append}
                        update={update}
                        remove={remove}
                        priceField="price"
                        priceLabel="Price"
                        onItemsChanged={() => clearMainErrors("items")}
                        getAvailableStock={getAvailableStock}
                    />

                    {errors.items && (
                        <p className="text-xs text-red-500 mt-2">{errors.items.message}</p>
                    )}

                    {/* ================= SUMMARY ================= */}
                    <div className="flex flex-col md:flex-row justify-between gap-6 mt-5 mr-10">
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold">No. of Products:</span>{" "}
                            {items.length}
                            <span className="ml-6 font-semibold">Total Quantity:</span>{" "}
                            {totalQuantity}
                        </div>

                        <div className="w-full md:w-80 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Gross</span>
                                <span className="font-semibold">Rs. {gross.toLocaleString()}</span>
                            </div>

                            <div className="border-t border-slate-300 pt-3 flex justify-between items-center gap-2">
                                <span className="text-slate-800">Discount</span>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-20">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            {...register("totalDiscount", {
                                                min: { value: 0, message: "Min 0" },
                                                max: { value: 100, message: "Max 100" },
                                            })}
                                            placeholder="0"
                                            className="w-full h-10 px-2 pr-6 text-slate-800 text-sm text-right rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
                                            %
                                        </span>
                                    </div>
                                    <span className="font-semibold whitespace-nowrap">
                                        Rs. {discountAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            {errors.totalDiscount && (
                                <p className="text-xs text-red-500 text-right">
                                    {errors.totalDiscount.message}
                                </p>
                            )}

                            <div className="border-t border-slate-300 pt-3 flex justify-between">
                                <span className="font-bold text-slate-800">Net</span>
                                <span className="font-bold text-lg text-blue-600">
                                    Rs. {netAmount.toLocaleString()}
                                </span>
                            </div>

                            <div className="border-t border-slate-300 pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-800">
                                        Amount Received
                                    </span>
                                    <input
                                        type="number"
                                        min="0"
                                        {...register("amountPaid", {
                                            required: "Amount received is required",
                                            min: { value: 0, message: "Min 0" },
                                        })}
                                        placeholder="0"
                                        className="w-32 h-11 px-4 text-blue-600 font-bold text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {errors.amountPaid && (
                                    <p className="text-xs text-red-500 mt-1 text-right">
                                        {errors.amountPaid.message}
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-slate-300 pt-3 flex justify-between items-center">
                                <span className="font-bold text-slate-800">Balance</span>
                                <span
                                    className={`font-bold text-lg ${balance > 0 ? "text-red-600" : "text-green-600"}`}
                                >
                                    Rs. {balance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isEdit ? "Update Order" : "Add Order"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddOrderModal;