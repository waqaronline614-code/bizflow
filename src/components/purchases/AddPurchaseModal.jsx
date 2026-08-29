import { useForm, useFieldArray } from "react-hook-form";
import { FiCheck, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEffect, useState } from "react";

function AddPurchaseModal({
    isOpen,
    onClose,
    suppliers,
    products,
    onAddPurchase,
    isEdit,
    editingPurchase
}) {
    // ---- MAIN FORM: supplier, payment status, date, items ----
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
            supplierId: "",
            paymentStatus: "",
            purchaseDate: "",
            amountPaid: "",
            totalDiscount: 0,
            items: [],
        },
    });

    const { fields: items, append, remove, update } = useFieldArray({
        control,
        name: "items",
    });

    // ---- DRAFT FORM: the always-visible new-item input row ----
    // Kept as a SEPARATE form instance on purpose — if it lived on the
    // main form, its `required` rules would block the main submit even
    // when the draft row is (correctly) empty after adding a line item.
    const {
        register: registerDraft,
        watch: watchDraft,
        trigger: triggerDraft,
        getValues: getDraftValues,
        setValue: setDraftValue,
        reset: resetDraft,
        formState: { errors: draftErrors },
    } = useForm({
        defaultValues: {
            productId: "",
            quantity: "",
            purchasePrice: "",
            disPrice: "",
        },
    });
    const [editingIndex, setEditingIndex] = useState(null);
    const draftQuantity = watchDraft("quantity");
    const draftPurchasePrice = watchDraft("purchasePrice");
    const draftDisPrice = watchDraft("disPrice");
    const amountPaidRaw = watch("amountPaid");
    const totalDiscountRaw = watch("totalDiscount");

    // ---- HOOKS THAT MUST RUN EVERY RENDER (before any early return) ----

    useEffect(() => {
        if (isEdit, editingPurchase) {
            reset(editingPurchase)
        }

    }, [reset, editingPurchase,])

    // --------------------------------
    // Helpers
    // --------------------------------
    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    // --------------------------------
    // Totals
    // --------------------------------
    const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const gross = items.reduce(
        (total, item) => total + item.amount,
        0
    );

    // Order-level discount (entered as %, defaults to 0)
    const discountPercent = safeNum(totalDiscountRaw);
    const discountAmount = gross * (discountPercent / 100);
    const netAmount = gross - discountAmount;

    const amountPaid = safeNum(amountPaidRaw);
    const balance = netAmount - amountPaid;

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

    // ---- Safe to bail out now — every hook above has already run ----
    if (!isOpen) return null;

    // --------------------------------
    // Edit the row
    // --------------------------------
    const startEdit = (index) => {
        const item = items[index];
        resetDraft({
            productId: item.productId,
            quantity: item.quantity,
            purchasePrice: item.purchasePrice,
            disPrice: item.disPrice,
        });
        setEditingIndex(index);
    };

    // --------------------------------
    // Add current row (validated by the draft form only)
    // --------------------------------
    const addItem = async () => {
        const valid = await triggerDraft();
        if (!valid) return;

        const values = getDraftValues();

        const product = products.find(
            (p) => String(p.id) === String(values.productId)
        );

        const quantity = safeNum(values.quantity);
        const purchasePrice = safeNum(values.purchasePrice);
        const disPrice = safeNum(values.disPrice);
        const subTotal = quantity * purchasePrice;
        const disInPercentage = subTotal * (disPrice) / 100;

        const itemData = {
            id: Date.now(),
            productId: values.productId,
            productName: product?.productName || "",
            unit: product?.unit || "Piece",
            quantity,
            purchasePrice,
            disPrice,
            amount: subTotal - disInPercentage,
        };

        if (editingIndex !== null) {
            update(editingIndex, itemData);
            setEditingIndex(null);
        } else {
            append(itemData);
        }
        clearDraft();

        // Adding a valid item means the "at least one item" error
        // (if it was showing) is no longer accurate — clear it.
        clearMainErrors("items");
    };

    // --------------------------------
    // Clear the draft row
    // --------------------------------
    const clearDraft = () => {
        resetDraft({ productId: "", quantity: "", purchasePrice: "", disPrice: "" });
        setEditingIndex(null);
    };

    // --------------------------------
    // Enter key
    // --------------------------------
    const handleQuantityKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addItem();
        }
    };

    // --------------------------------
    // Delete saved item
    // --------------------------------
    const deleteItem = (index) => {
        remove(index);
    };

    // --------------------------------
    // Final submit
    // --------------------------------
    const onSubmit = (data) => {
        if (items.length === 0) {
            setError("items", {
                type: "manual",
                message: "Add at least one product",
            });
            return;
        } else {
            onAddPurchase(data);
            reset({
                supplierId: "",
                paymentStatus: "",
                purchaseDate: "",
                amountPaid: "",
                totalDiscount: 0,
                items: [],
            });
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full  max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ================= HEADER ================= */}

                <div className="px-6 py-5 border-b border-slate-200 shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isEdit ? "Update Purchase" : "Add Purchase"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {isEdit ? "Update a Purchase" : "Create a Purchase"}
                    </p>
                </div>


                {/* ================= CONTENT ================= */}

                <div className="p-6 overflow-y-auto">

                    {/* Supplier + Payment Status + Date */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

                        {/* Supplier */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Supplier
                            </label>

                            <select
                                {...register("supplierId", {
                                    required: "Supplier is required",
                                })}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">
                                    Select Supplier
                                </option>

                                {suppliers.map((supplier) => (
                                    <option
                                        key={supplier.id}
                                        value={supplier.id}
                                    >
                                        {supplier.supplierName}
                                    </option>
                                ))}
                            </select>

                            {errors.supplierId && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.supplierId.message}
                                </p>
                            )}
                        </div>


                        {/* Payment Status — computed automatically, sent to DB, not shown in this form */}
                        <input type="hidden" {...register("paymentStatus")} />


                        {/* Purchase Date */}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Purchase Date
                            </label>

                            <input
                                type="date"
                                {...register("purchaseDate", {
                                    required: "Purchase date is required",
                                })}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.purchaseDate && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.purchaseDate.message}
                                </p>
                            )}
                        </div>

                    </div>


                    {/* ================= PRODUCT TABLE ================= */}

                    <div className="border border-slate-200 rounded-xl overflow-hidden">

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[800px]">

                                {/* HEADER */}

                                <thead className="bg-slate-50 border-b border-slate-200">

                                    <tr>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 min-w-[210px]">
                                            Product
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                            Quantity
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                            Price
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                            Disc.
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                            Amount
                                        </th>

                                        <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700">
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {/* ================= SAVED ROWS ================= */}

                                    {items.map((item, index) => (

                                        <tr
                                            key={item.id}
                                            className="border-b border-slate-100"
                                        >

                                            <td className="px-4 py-3 text-sm text-slate-700">
                                                {item.productName}
                                            </td>

                                            <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                {item.quantity} {item.unit}
                                            </td>

                                            <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                {item.purchasePrice}
                                            </td>

                                            <td className="px-4 py-3 text-center text-sm text-slate-700">
                                                {item.disPrice} %
                                            </td>

                                            <td className="px-4 py-3 text-center font-semibold text-slate-800">
                                                {item.amount.toLocaleString()}
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-2">

                                                    <button
                                                        type="button"
                                                        className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                                                        onClick={() => startEdit(index)}
                                                    >
                                                        <FiEdit2 size={17} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => deleteItem(index)}
                                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                                    >
                                                        <FiTrash2 size={17} />
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>

                                    ))}


                                    {/* ================= NEW INPUT ROW ================= */}

                                    <tr className="bg-slate-50">

                                        {/* Product */}

                                        <td className="px-4 py-3">

                                            <select
                                                {...registerDraft("productId", {
                                                    required: "Select a product",
                                                    onChange: (e) => {
                                                        const selected = products.find((product) =>
                                                            String(product.id) === String(e.target.value));
                                                        setDraftValue(
                                                            "purchasePrice",
                                                            selected?.purchasePrice ?? "",
                                                            { shouldValidate: true }
                                                        );
                                                        setDraftValue("quantity", 1, { shouldValidate: true });
                                                        setDraftValue("disPrice", 0, { shouldValidate: true });
                                                    }
                                                })}
                                                className="w-full h-10 px-3 rounded-lg border 
                                                border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Select Product
                                                </option>

                                                {products.map((product) => (
                                                    <option
                                                        key={product.id}
                                                        value={product.id}
                                                    >
                                                        {product.productName}
                                                    </option>
                                                ))}

                                            </select>

                                            {draftErrors.productId && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    {draftErrors.productId.message}
                                                </p>
                                            )}

                                        </td>


                                        {/* Quantity */}

                                        <td className="px-4 py-3">

                                            <input
                                                type="number"
                                                min="1"
                                                {...registerDraft("quantity", {
                                                    required: "Required",
                                                    min: {
                                                        value: 1,
                                                        message: "Min 1",
                                                    },
                                                })}
                                                onKeyDown={handleQuantityKeyDown}
                                                placeholder="0"
                                                className="w-24 h-10 mx-auto block px-3 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                            {draftErrors.quantity && (
                                                <p className="text-xs text-red-500 mt-1 text-center">
                                                    {draftErrors.quantity.message}
                                                </p>
                                            )}

                                        </td>


                                        {/* Price */}

                                        <td className="px-4 py-3">

                                            <input
                                                type="number"
                                                min="0"
                                                {...registerDraft("purchasePrice", {
                                                    required: "Required",
                                                    min: {
                                                        value: 0,
                                                        message: "Min 0",
                                                    },
                                                })}
                                                placeholder="0"
                                                className="w-28 h-10 mx-auto block px-3 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                            {draftErrors.purchasePrice && (
                                                <p className="text-xs text-red-500 mt-1 text-center">
                                                    {draftErrors.purchasePrice.message}
                                                </p>
                                            )}

                                        </td>

                                        {/* Discount */}
                                        <td className="px-4 py-3 text-center">
                                            <div className="relative w-24 mx-auto">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.5"
                                                    {...registerDraft("disPrice", {
                                                        min: { value: 0, message: "Min 0" },
                                                        max: { value: 100, message: "Max 100" },
                                                    })}
                                                    placeholder="0"
                                                    className="w-full h-10 px-3 pr-7 rounded-lg border border-slate-300 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400
                                                 text-sm pointer-events-none">
                                                    %
                                                </span>
                                            </div>
                                            {draftErrors.disPrice && (
                                                <p className="text-xs text-red-500 mt-1 text-center">
                                                    {draftErrors.disPrice.message}
                                                </p>
                                            )}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-4 py-3 text-center font-semibold text-slate-700">
                                            Rs.{" "}
                                            {(() => {
                                                const subtotal = safeNum(draftQuantity) * safeNum(draftPurchasePrice);
                                                const disAmount = subtotal * (safeNum(draftDisPrice) / 100);
                                                return (subtotal - disAmount).toLocaleString();
                                            })()}
                                        </td>


                                        {/* Check / Cancel */}

                                        <td className="px-4 py-3">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    type="button"
                                                    onClick={addItem}
                                                    className="p-2 rounded-lg text-green-600 hover:bg-green-100 transition"
                                                    title="Add item"
                                                >
                                                    <FiCheck size={20} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={clearDraft}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition"
                                                    title="Clear"
                                                >
                                                    <FiX size={20} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </div>

                    </div>

                    {errors.items && (
                        <p className="text-xs text-red-500 mt-2">
                            {errors.items.message}
                        </p>
                    )}


                    {/* ================= SUMMARY ================= */}

                    <div className="flex flex-col md:flex-row justify-between gap-6 mt-5 mr-10">

                        <div className="text-sm text-slate-600">

                            <span className="font-semibold">
                                No. of Products:
                            </span>{" "}
                            {items.length}

                            <span className="ml-6 font-semibold">
                                Total Quantity:
                            </span>{" "}
                            {totalQuantity}

                        </div>

                        <div className="w-full md:w-80 space-y-3 text-sm">

                            {/* Gross */}

                            <div className="flex justify-between">
                                <span className="text-slate-600">
                                    Gross
                                </span>

                                <span className="font-semibold">
                                    Rs. {gross.toLocaleString()}
                                </span>
                            </div>

                            {/* Discount */}

                            <div className="border-t border-slate-300 pt-3 flex justify-between items-center gap-2">
                                <span className="text-slate-800">
                                    Discount
                                </span>

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
                                            className="w-full h-10 px-2 pr-6 text-slate-800 text-sm text-right
                                                rounded-xl border border-slate-300
                                                focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            {/* Net amount */}

                            <div className="border-t border-slate-300 pt-3 flex justify-between">

                                <span className="font-bold text-slate-800">
                                    Net
                                </span>

                                <span className="font-bold text-lg text-blue-600">
                                    Rs. {netAmount.toLocaleString()}
                                </span>

                            </div>

                            {/* Amount Paid */}

                            <div className="border-t border-slate-300 pt-3">

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-800">
                                        Amount Paid
                                    </span>

                                    <input
                                        type="number"
                                        min="0"
                                        {...register("amountPaid", {
                                            required: "Amount paid is required",
                                            min: { value: 0, message: "Min 0" },
                                        })}
                                        placeholder="0"
                                        className="w-32 h-11 px-4  text-blue-600 font-bold text-sm 
                                        rounded-xl border border-slate-300 
                                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {errors.amountPaid && (
                                    <p className="text-xs text-red-500 mt-1 text-right">
                                        {errors.amountPaid.message}
                                    </p>
                                )}

                            </div>

                            {/* Balance */}

                            <div className="border-t border-slate-300 pt-3 flex justify-between items-center">
                                <span className="font-bold text-slate-800">
                                    Balance
                                </span>

                                <span className={`font-bold text-lg ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
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
                        onClick={() => {
                            reset({
                                supplierId: "",
                                paymentStatus: "",
                                purchaseDate: "",
                                amountPaid: "",
                                totalDiscount: 0,
                                items: [],
                            });
                            onClose()
                        }}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isEdit ? "Update Purchase" : "Add Purchase"}
                    </button>

                </div>

            </div>
        </div>
    );
}

export default AddPurchaseModal;