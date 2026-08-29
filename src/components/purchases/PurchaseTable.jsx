import { FiEye, FiEdit2, FiTrash2, FiCalendar, FiPackage } from "react-icons/fi";

function PurchaseTable({ purchases = [],
                         suppliers = [], 
                         onView, onEdit, onDelete, }) {

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

    const safeNum = (value) => {
        const num = Number(value);
        return Number.isNaN(num) ? 0 : num;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[640px] table-fixed">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 w-[110px]">
                                Invoice
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-slate-700 w-[220px]">
                                Supplier / Items
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[90px]">
                                Total
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[100px]">
                                Discount
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[90px]">
                                Paid
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[90px]">
                                Balance
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[80px]">
                                Status
                            </th>
                            <th className="px-2 py-2 text-center text-xs font-semibold text-slate-700 w-[80px]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>

                        {purchases.length === 0 ? (

                            <tr>
                                <td colSpan="8" className="py-8 text-center text-sm text-slate-500">
                                    No Purchases added yet.
                                </td>
                            </tr>

                        ) : (

                            purchases.map((purchase) => {

                                const items = Array.isArray(purchase.items) ? purchase.items : [];

                                const totalQuantity = items.reduce(
                                    (total, item) => total + safeNum(item.quantity),
                                    0
                                );

                                const totalAmount = items.reduce(
                                    (total, item) => total + safeNum(item.amount),
                                    0
                                );

                                const gross = totalAmount;
                                const discountPercent = safeNum(purchase.totalDiscount);
                                const discountBalance = gross * (discountPercent / 100);
                                const netAmount = gross - discountBalance;
                                const amountPaid = safeNum(purchase.amountPaid);
                                const balance = netAmount - amountPaid;

                                const supplier = suppliers.find(
                                    (supplier) => supplier.id.toString() === purchase.supplierId.toString()
                                );

                                const productNames = items
                                    .map((item) => item.productName)
                                    .filter(Boolean)
                                    .join(", ");

                                const invoiceLabel = purchase.invoiceNo || `#${purchase.id}`;

                                return (
                                    <tr
                                        key={purchase.id}
                                        className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200 align-top"
                                    >

                                        {/* Invoice + Date */}
                                        <td className="px-3 py-2.5">
                                            <div className="text-sm font-semibold text-slate-800 truncate">
                                                {invoiceLabel}
                                            </div>
                                            <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-500">
                                                <FiCalendar size={11} className="text-slate-400 shrink-0" />
                                                {formatDate(purchase.purchaseDate)}
                                            </div>
                                        </td>

                                        {/* Supplier + Items */}
                                        <td className="px-3 py-2.5">
                                            <div className="text-sm font-medium text-slate-800 truncate">
                                                {supplier?.supplierName || "-"}
                                            </div>

                                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                <FiPackage size={11} className="text-slate-400 shrink-0" />
                                                {items.length} item{items.length !== 1 ? "s" : ""} · {totalQuantity} qty
                                            </div>

                                            {productNames && (
                                                <div
                                                    title={productNames}
                                                    className="mt-1 max-w-full truncate text-[11px] font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5 inline-block"
                                                >
                                                    {productNames}
                                                </div>
                                            )}
                                        </td>

                                        {/* Total */}
                                        <td className="px-2 py-2.5 text-center text-sm font-semibold text-slate-800 whitespace-nowrap">
                                            {totalAmount.toLocaleString()}
                                        </td>

                                        {/* Discount (% + Rs combined) */}
                                        <td className="px-2 py-2.5 text-center text-xs text-slate-600 whitespace-nowrap">
                                            <div className="font-medium text-slate-700">{discountPercent}%</div>
                                            <div className="text-slate-500">Rs. {discountBalance.toLocaleString()}</div>
                                        </td>

                                        {/* Paid */}
                                        <td className="px-2 py-2.5 text-center text-sm font-semibold text-slate-800 whitespace-nowrap">
                                            {amountPaid.toLocaleString()}
                                        </td>

                                        {/* Balance */}
                                        <td className={`px-2 py-2.5 text-center text-sm font-semibold whitespace-nowrap ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                                            {balance.toLocaleString()}
                                        </td>

                                        {/* Status */}
                                        <td className="px-2 py-2.5 text-center">
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${purchase.paymentStatus?.toLowerCase() === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : purchase.paymentStatus?.toLowerCase() === "partial"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {purchase.paymentStatus}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-2 py-2.5">
                                            <div className="flex justify-center items-center gap-1">

                                                <button
                                                    type="button"
                                                    onClick={() => onView && onView(purchase)}
                                                    className="p-1 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                                                    title="View"
                                                >
                                                    <FiEye size={14} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onEdit && onEdit(purchase)}
                                                    className="p-1 rounded-lg hover:bg-green-100 text-green-600 transition"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDelete && onDelete(purchase)}
                                                    className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                );
                            })

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default PurchaseTable;