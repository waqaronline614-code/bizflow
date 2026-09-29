import { FiX, FiCalendar, FiUser, FiPackage, FiCreditCard } from "react-icons/fi";

function OrderViewModal({ isOpen, onClose, order, customers }) {
    if (!isOpen || !order) return null;

    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const items = Array.isArray(order.items) ? order.items : [];

    const gross = items.reduce((total, item) => total + safeNum(item.amount), 0);
    const discountPercent = safeNum(order.totalDiscount);
    const discountAmount = gross * (discountPercent / 100);
    const netAmount = gross - discountAmount;
    const amountPaid = safeNum(order.amountPaid);
    const balance = netAmount - amountPaid;

    const customer = customers.find(
        (c) => c.id?.toString() === order.customerId?.toString()
    );

    const status = order.paymentStatus?.toLowerCase() || "unpaid";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ================= HEADER ================= */}
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {order.orderNo || `#${order.id}`}
                        </h2>
                        <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                            <FiCalendar size={14} className="text-slate-400" />
                            {formatDate(order.orderDate)}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition"
                    >
                        &times;
                    </button>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-6 overflow-y-auto space-y-6">

                    {/* Customer + Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiUser className="text-slate-400" />
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {customer?.fullName || "Unknown customer"}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {customer?.phone || "-"}
                                </p>
                            </div>
                        </div>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                status === "paid"
                                    ? "bg-green-100 text-green-700"
                                    : status === "partial"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                            }`}
                        >
                            {status}
                        </span>
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FiPackage className="text-slate-400" />
                            <p className="text-sm font-semibold text-slate-700">
                                Items ({items.length})
                            </p>
                        </div>
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
                                            Product
                                        </th>
                                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600">
                                            Qty
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-600">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" className="px-3 py-4 text-center text-xs text-slate-400">
                                                No items
                                            </td>
                                        </tr>
                                    ) : (
                                        items.map((item, idx) => (
                                            <tr key={idx} className="border-t border-slate-100">
                                                <td className="px-3 py-2 text-slate-700">
                                                    {item.productName || "-"}
                                                </td>
                                                <td className="px-3 py-2 text-center text-slate-600">
                                                    {safeNum(item.quantity)}
                                                </td>
                                                <td className="px-3 py-2 text-right text-slate-700">
                                                    Rs {safeNum(item.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Gross Total</span>
                            <span className="font-medium text-slate-800">
                                Rs {gross.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">
                                Discount ({discountPercent}%)
                            </span>
                            <span className="font-medium text-slate-800">
                                - Rs {discountAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                            <span className="text-slate-600 font-semibold">Net Total</span>
                            <span className="font-semibold text-slate-900">
                                Rs {netAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Amount Paid</span>
                            <span className="font-medium text-green-600">
                                Rs {amountPaid.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                            <span className="text-slate-600 font-semibold flex items-center gap-1">
                                <FiCreditCard size={14} />
                                Balance
                            </span>
                            <span className={`font-bold ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                                Rs {balance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="flex justify-end gap-3 px-6 py-5 border-t border-slate-200 shrink-0 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default OrderViewModal;