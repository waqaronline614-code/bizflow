import { FiEye, FiEdit2, FiTrash2, FiCalendar, FiUser } from "react-icons/fi";

function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function MadePaymentsTable({ payments, suppliers, purchases, onView, onEdit, onDelete }) {
    const getSupplierName = (partyId) => {
        const supplier = suppliers?.find((s) => s.id === partyId);
        return supplier?.supplierName || "Unknown supplier";
    };
    const getAppliedTo = (payment) => {
        if (payment.relatedType === "purchase" && payment.relatedId) {
            const purchase = purchases?.find((p) => p.id === payment.relatedId);
            return purchase?.purchaseNo ? `Purchase ${purchase.purchaseNo}` : "Purchase";
        }
        return "Supplier balance";
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden text-sm">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[600px] table-fixed">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-2 py-1.5 text-left text-[14px] font-semibold text-slate-700 w-[95px]">
                                Payment #
                            </th>
                            <th className="px-2 py-1.5 text-left text-[14px] font-semibold text-slate-700 w-[190px]">
                                Supplier / Applied To
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-[14px] font-semibold text-slate-700 w-[80px]">
                                Method
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-[14px] font-semibold text-slate-700 w-[100px]">
                                Reference
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-[14px] font-semibold text-slate-700 w-[70px]">
                                Amount
                            </th>
                            <th className="px-1.5 py-1.5 text-center text-[14px] font-semibold text-slate-700 w-[65px]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {payments.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-150 align-top"
                            >

                                {/* Payment # + Date */}
                                <td className="px-2 py-1.5">
                                    <div className="text-xs font-semibold text-slate-800 truncate">
                                        {payment.paymentNo}
                                    </div>
                                    <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-500">
                                        <FiCalendar size={10} className="text-slate-400 shrink-0" />
                                        {formatDate(payment.date)}
                                    </div>
                                </td>

                                {/* Supplier + Applied To */}
                                <td className="px-2 py-1.5">
                                    <div className="text-xs font-medium text-slate-800 truncate">
                                        {getSupplierName(payment.partyId)}
                                    </div>
                                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                                        <FiUser size={10} className="text-slate-400 shrink-0" />
                                        {getAppliedTo(payment)}
                                    </div>
                                </td>

                                {/* Method */}
                                <td className="px-1.5 py-1.5 text-center">
                                    <span className="inline-block px-1.5 py-0.5
                                     rounded-full text-[11px] font-semibold whitespace-nowrap">
                                        {payment.method}
                                    </span>
                                </td>

                                {/* Reference */}
                                <td className="px-1.5 py-1.5 text-center text-[14px] text-slate-600 truncate">
                                    {payment.reference}
                                </td>

                                {/* Amount */}
                                <td className="px-1.5 py-1.5 text-center text-xs font-semibold text-slate-800 whitespace-nowrap">
                                    {payment.amount.toLocaleString()}
                                </td>

                                {/* Actions */}
                                <td className="px-1.5 py-1.5">
                                    <div className="flex justify-center items-center gap-0.5">
                                        <button
                                            type="button"
                                            onClick={() => onView?.(payment)}
                                            className="p-1 rounded-md hover:bg-blue-100 text-blue-600 transition"
                                            title="View"
                                        >
                                            <FiEye size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit?.(payment)}
                                            className="p-1 rounded-md hover:bg-green-100 text-green-600 transition"
                                            title="Edit"
                                        >
                                            <FiEdit2 size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete?.(payment)}
                                            className="p-1 rounded-md hover:bg-red-100 text-red-600 transition"
                                            title="Delete"
                                        >
                                            <FiTrash2 size={12} />
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default MadePaymentsTable;