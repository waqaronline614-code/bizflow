import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccounts } from "../../hooks/Useaccounts";
function AddReceivedPaymentModal({
    onClose,
    isOpen,
    orders,
    customers,
    onSave,
    isEdit,
    editingPayment,
}) {
    const [linkType, setLinkType] = useState("order");
    const {accounts} = useAccounts();

    const today = new Date().toISOString().slice(0, 10);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        shouldUnregister: true,
        defaultValues: {
            paymentDate: today,
            method: "",
        },
    });

    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    const getCustomerName = (customerId) =>
        customers.find((c) => c.id === customerId)?.fullName || "Unknown customer";

    const getOrderLabel = (orderId) => {
        const order = orders.find((o) => o.id === orderId);
        return order ? `${order.orderNo} — ${getCustomerName(order.customerId)}` : "Order";
    };

    const getAccountName = (accountId) =>
        accounts.find((a) => a.id === accountId)?.name || "Unknown account";

    // --------------------------------
    // Load values when opening for edit / reset when opening fresh
    // --------------------------------
    useEffect(() => {
        if (!isOpen) return;

        if (isEdit && editingPayment) {
            setLinkType(editingPayment.relatedType === "order" ? "order" : "standalone");
            reset({
                orderId: editingPayment.relatedId || "",
                customerId: editingPayment.partyId || "",
                paymentDate: editingPayment.date || today,
                amountReceived: String(editingPayment.amount ?? ""),
                method: editingPayment.method || "",
                referenceNote: editingPayment.reference || "",
            });
        } else {
            setLinkType("order");
            reset({
                paymentDate: today,
                method: "",
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, isEdit, editingPayment]);

    const onSubmit = (data) => {
        const payload = {
            type: "received",
            partyType: "customer",
            partyId: isEdit
                ? editingPayment.partyId
                : linkType === "order"
                    ? orders.find((o) => o.id === data.orderId)?.customerId
                    : data.customerId,
            relatedType: isEdit ? editingPayment.relatedType : linkType === "order" ? "order" : null,
            relatedId: isEdit ? editingPayment.relatedId : linkType === "order" ? data.orderId : null,
            amount: safeNum(String(data.amountReceived).replace(/,/g, "")),
            date: data.paymentDate,
            method: data.method,
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
                            {isEdit ? "Edit Payment" : "Record Received Payment"}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            {isEdit
                                ? "Update the amount, date, account or reference"
                                : "Log a payment received from a customer"}
                        </p>
                    </div>
                    <button type="button" onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition mb-7">
                        &times;
                    </button>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 overflow-y-auto">

                    {/* Apply to: order or customer balance */}
                    {!isEdit && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Apply This Payment To
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setLinkType("order")}
                                    className={`flex items-center justify-center h-11 rounded-xl border text-sm 
                                        font-medium transition ${linkType === "order"
                                            ? "border-blue-500 bg-blue-50 text-blue-600"
                                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    A Specific Order
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
                                    Customer Balance
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Order/Customer (locked when editing) + Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        {isEdit ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Applied To
                                </label>
                                <div className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-600">
                                    {editingPayment?.relatedType === "order"
                                        ? getOrderLabel(editingPayment.relatedId)
                                        : `${getCustomerName(editingPayment?.partyId)} — Customer balance`}
                                </div>
                                <p className="mt-1 text-xs text-slate-400">
                                    Can't be changed after the payment is recorded
                                </p>
                            </div>
                        ) : linkType === "order" ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Order
                                </label>
                                <select
                                    className="w-full h-11 px-4 rounded-xl border border-slate-300
                                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("orderId", {
                                        required: "Select the order number",
                                    })}
                                >
                                    <option value="">Select Order</option>
                                    {orders.map((order) => {
                                        const items = Array.isArray(order.items) ? order.items : [];
                                        const totalAmount = items.reduce((total, item) => total + safeNum(item.amount), 0);
                                        const discountAmount = totalAmount * safeNum(order.totalDiscount) / 100;
                                        const netAmount = totalAmount - discountAmount;
                                        const balance = netAmount - safeNum(order.amountPaid);
                                        return (
                                            <option key={order.id} value={order.id}>
                                                {order.orderNo} — {getCustomerName(order.customerId)} — Balance Rs. {balance.toLocaleString()}
                                            </option>
                                        );
                                    })}
                                </select>
                                {errors.orderId && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.orderId.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Customer
                                </label>
                                <select
                                    className="w-full h-11 px-4 rounded-xl border border-slate-300
                                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("customerId", {
                                        required: "Customer name is required",
                                    })}
                                >
                                    <option value="">Select Customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.fullName}
                                        </option>
                                    ))}
                                </select>
                                {errors.customerId && (
                                    <p className="mt-1 text-sm text-red-500">{errors.customerId.message}</p>
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

                    {/* Amount + Account */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Amount Received
                            </label>
                            <input
                                {...register("amountReceived", {
                                    required: "Amount received is required",
                                    validate: (v) =>
                                        safeNum(String(v).replace(/,/g, "")) > 0 || "Enter a valid amount",
                                })}
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
                                className="w-full h-11 px-4 text-blue-600 font-bold text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.amountReceived && (
                                <p className="mt-1 text-sm text-red-500">{errors.amountReceived.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Received Into
                            </label>
                            <select
                                {...register("method", {
                                    required: "Choose an account",
                                })}
                                className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select account</option>
                                {accounts.map((account) => (
                                    <option key={account.id} value={account.name}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                            {errors.method && (
                                <p className="mt-1 text-sm text-red-500">{errors.method.message}</p>
                            )}
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

export default AddReceivedPaymentModal;