import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccounts } from "../../hooks/Useaccounts";

function AddMadePaymentModal({
    onClose,
    isOpen,
    purchases = [],
    suppliers = [],
    onSave,
    isEdit,
    editingPayment,
}) {
    const [linkType, setLinkType] = useState("purchase");

    const today = new Date().toISOString().slice(0, 10);
    const {accounts} = useAccounts();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        shouldUnregister: true,
        defaultValues: {
            paymentDate: today,
            paymentMethod: "Cash",
        },
    });

    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    const getSupplierName = (supplierId) =>
        suppliers.find((s) => s.id === supplierId)?.supplierName || "Unknown supplier";

    const getPurchaseLabel = (purchaseId) => {
        const purchase = purchases.find((p) => p.id === purchaseId);
        return purchase ? `${purchase.purchaseNo} — ${getSupplierName(purchase.supplierId)}` : "Purchase";
    };

    // --------------------------------
    // Load values when opening for edit / reset when opening fresh
    // --------------------------------
    useEffect(() => {
        if (!isOpen) return;

        if (isEdit && editingPayment) {
            setLinkType(editingPayment.relatedType === "purchase" ? "purchase" : "standalone");
            reset({
                purchaseId: editingPayment.relatedId || "",
                supplierId: editingPayment.partyId || "",
                paymentDate: editingPayment.date || today,
                amountPaid: String(editingPayment.amount ?? ""),
                paymentMethod: editingPayment.method || "Cash",
                referenceNote: editingPayment.reference || "",
            });
        } else {
            setLinkType("purchase");
            reset({
                paymentDate: today,
                paymentMethod: "Cash",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isEdit, editingPayment]);

    const onSubmit = (data) => {
        const payload = {
            type: "made",
            partyType: "supplier",
            partyId: isEdit
                ? editingPayment.partyId
                : linkType === "purchase"
                    ? purchases.find((p) => p.id === data.purchaseId)?.supplierId
                    : data.supplierId,
            relatedType: isEdit ? editingPayment.relatedType : linkType === "purchase" ? "purchase" : null,
            relatedId: isEdit ? editingPayment.relatedId : linkType === "purchase" ? data.purchaseId : null,
            amount: safeNum(String(data.amountPaid).replace(/,/g, "")),
            date: data.paymentDate,
            method: data.paymentMethod,
            reference: data.referenceNote || "",
        };

        onSave?.(payload);
        reset();
        onClose();
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {isEdit ? "Edit Payment" : "Make Payment"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEdit
                                ? "Update the amount, date, method or reference"
                                : "Log a payment made to a supplier"}
                        </p>
                    </div>
                    <button type="button" onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition mb-7">
                        &times;
                    </button>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 overflow-y-auto">

                    {/* Apply to: purchase or supplier balance */}
                    {!isEdit && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Apply This Payment To
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setLinkType("purchase")}
                                    className={`flex items-center justify-center h-11 rounded-xl border text-sm 
                                        font-medium transition ${linkType === "purchase"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    A Specific Purchase
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLinkType("standalone")}
                                    className={`flex items-center justify-center h-11 rounded-xl border text-sm
                                         font-medium transition ${linkType === "standalone"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    Supplier Balance
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Purchase/Supplier (locked when editing) + Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        {isEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Applied To
                                </label>
                                <div className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-600">
                                    {editingPayment?.relatedType === "purchase"
                                        ? getPurchaseLabel(editingPayment.relatedId)
                                        : `${getSupplierName(editingPayment?.partyId)} — Supplier balance`}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    Can't be changed after the payment is recorded
                                </p>
                            </div>
                        ) : linkType === "purchase" ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Purchase
                                </label>
                                <select
                                    className="w-full h-11 px-4 rounded-xl border border-slate-300
                                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("purchaseId", {
                                        required: "Select the purchase invoice",
                                    })}
                                >
                                    <option value="">Select Purchase</option>
                                    {purchases.map((purchase) => {
                                        const items = Array.isArray(purchase.items) ? purchase.items : [];
                                        const totalAmount = items.reduce((total, item) => total + safeNum(item.amount), 0);
                                        const discountAmount = totalAmount * safeNum(purchase.totalDiscount) / 100;
                                        const netAmount = totalAmount - discountAmount;
                                        const balance = netAmount - safeNum(purchase.amountPaid);
                                        return (
                                            <option key={purchase.id} value={purchase.id}>
                                                {purchase.purchaseNo} — {getSupplierName(purchase.supplierId)} — Balance Rs. {balance.toLocaleString()}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.purchaseId && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.purchaseId.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Supplier
                                </label>
                                <select
                                    className="w-full h-11 px-4 rounded-xl border border-slate-300
                                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("supplierId", {
                                        required: "Supplier name is required",
                                    })}
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.supplierName}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplierId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.supplierId.message}</p>
                                )}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Date
                            </label>
                            <input
                                {...register("paymentDate", {
                                    required: "Payment date is required",
                                })}
                                type="date"
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 
                                focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.paymentDate && (
                                <p className="mt-1 text-sm text-red-500">{errors.paymentDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Amount + Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Amount Paid
                            </label>
                            <input
                                {...register("amountPaid", {
                                    required: "Amount paid is required",
                                    validate: (v) =>
                                        safeNum(String(v).replace(/,/g, "")) > 0 || "Enter a valid amount",
                                })}
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                className="w-full h-11 px-4 text-blue-600 font-bold text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.amountPaid && (
                                <p className="mt-1 text-sm text-red-500">{errors.amountPaid.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Payment Method
                            </label>
                            <select
                                {...register("paymentMethod")}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Select Methods</option>
                                { 
                                accounts.map((account)=>(

                                    <option key={account.id} value={account.name} >{account.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    {/* Reference note */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reference Note
                        </label>
                        <textarea
                            {...register("referenceNote")}
                            rows={2}
                            placeholder="e.g. Cheque #4471, partial settlement"
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 shrink-0 bg-white">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100">
                        Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700">
                        {isEdit ? "Update Payment" : "Save Payment"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddMadePaymentModal;