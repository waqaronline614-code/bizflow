function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{label}</span>
            <span className="text-sm font-medium text-slate-800 text-right">{value}</span>
        </div>
    );
}

function PaymentViewModal({ isOpen, onClose, payment, customers, orders }) {
    if (!isOpen || !payment) return null;

    const customerName =
        customers?.find((c) => c.id === payment.partyId)?.fullName || "Unknown customer";

    const appliedTo =
        payment.relatedType === "order" && payment.relatedId
            ? orders?.find((o) => o.id === payment.relatedId)?.orderNo
                ? `Order ${orders.find((o) => o.id === payment.relatedId).orderNo}`
                : "Order"
            : "Customer balance";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {payment.paymentNo}
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Payment details</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-3xl text-slate-400 hover:text-red-500 transition"
                    >
                        &times;
                    </button>
                </div>

                <div className="px-6 py-4">
                    <Row label="Customer" value={customerName} />
                    <Row label="Applied To" value={appliedTo} />
                    <Row label="Date" value={formatDate(payment.date)} />
                    <Row label="Method" value={payment.method} />
                    <Row label="Reference" value={payment.reference || "—"} />
                    <Row
                        label="Amount"
                        value={`Rs. ${(payment.amount || 0).toLocaleString()}`}
                    />
                </div>

                <div className="flex justify-end px-6 py-5 border-t border-slate-200 bg-white">
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

export default PaymentViewModal;