import { FiEye, FiEdit2, FiTrash2, FiCalendar, FiUser } from "react-icons/fi";
import Pagination from "../common/Pagination";

function OrderTable({
    orders = [],
    customers = [],
    onView,
    onEdit,
    onDelete,
    currentPage,
    totalPages,
    totalOrders,
    ordersPerPage,
    onPageChange,
}) {

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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-sm">

            <div className="overflow-x-auto">

                <table className="w-full min-w-[700px] table-fixed">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-2 py-2 text-left text-[14px] font-semibold text-slate-700 w-[100px]">
                                Order
                            </th>
                            <th className="px-2 py-2 text-left text-[14px] font-semibold text-slate-700 w-[190px]">
                                Customer / Items
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[75px]">
                                Total
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[85px]">
                                Discount
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[75px]">
                                Net
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[75px]">
                                Paid
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[75px]">
                                Balance
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[70px]">
                                Status
                            </th>
                            <th className="px-1.5 py-2 text-center text-[14px] font-semibold text-slate-700 w-[70px]">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>

                        {orders.length === 0 ? (

                            <tr>
                                <td colSpan="9" className="py-7 text-center text-xs text-slate-500">
                                    No Orders added yet.
                                </td>
                            </tr>

                        ) : (

                            orders.map((order) => {

                                const items = Array.isArray(order.items) ? order.items : [];

                                const totalQuantity = items.reduce(
                                    (total, item) => total + safeNum(item.quantity),
                                    0
                                );

                                const gross = items.reduce(
                                    (total, item) => total + safeNum(item.amount),
                                    0
                                );

                                const discountPercent = safeNum(order.totalDiscount);
                                const discountAmount = gross * (discountPercent / 100);
                                const netAmount = gross - discountAmount;
                                const amountPaid = safeNum(order.amountPaid);
                                const balance = netAmount - amountPaid;

                                const customer = customers.find(
                                    (c) => c.id?.toString() === order.customerId?.toString()
                                );

                                const productNames = items
                                    .map((item) => item.productName)
                                    .filter(Boolean)
                                    .join(", ");

                                const orderLabel = order.orderNo || `#${order.id}`;

                                const status = order.paymentStatus?.toLowerCase() || "unpaid";

                                return (
                                    <tr
                                        key={order.id}
                                        className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-150 align-top"
                                    >

                                        {/* Order + Date */}
                                        <td className="px-2 py-2">
                                            <div className="text-xs font-semibold text-slate-800 truncate">
                                                {orderLabel}
                                            </div>
                                            <div className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-slate-500">
                                                <FiCalendar size={10} className="text-slate-400 shrink-0" />
                                                {formatDate(order.orderDate)}
                                            </div>
                                        </td>

                                        {/* Customer + Items */}
                                        <td className="px-2 py-2">
                                            <div className="text-xs font-medium text-slate-800 truncate">
                                                {customer?.fullName || "-"}
                                            </div>

                                            <div className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                                                <FiUser size={10} className="text-slate-400 shrink-0" />
                                                {items.length} item{items.length !== 1 ? "s" : ""} · {totalQuantity} qty
                                            </div>

                                            {productNames && (
                                                <div
                                                    title={productNames}
                                                    className="mt-0.5 max-w-full truncate text-[10px] font-medium text-blue-700 bg-blue-50 rounded-full px-1.5 py-0.5 inline-block"
                                                >
                                                    {productNames}
                                                </div>
                                            )}
                                        </td>

                                        {/* Total */}
                                        <td className="px-1.5 py-2 text-center text-xs font-semibold text-slate-800 whitespace-nowrap">
                                            {gross.toLocaleString()}
                                        </td>

                                        {/* Discount (% + Rs combined) */}
                                        <td className="px-1.5 py-2 text-center text-[14px] text-slate-600 whitespace-nowrap">
                                            <div className="font-medium text-slate-700">{discountPercent}%</div>
                                            <div className="text-slate-500">Rs. {discountAmount.toLocaleString()}</div>
                                        </td>

                                        {/* Net */}
                                        <td className="px-1.5 py-2 text-center text-xs font-semibold text-slate-800 whitespace-nowrap">
                                            {netAmount.toLocaleString()}
                                        </td>

                                        {/* Paid */}
                                        <td className="px-1.5 py-2 text-center text-xs font-semibold text-slate-800 whitespace-nowrap">
                                            {amountPaid.toLocaleString()}
                                        </td>

                                        {/* Balance */}
                                        <td className={`px-1.5 py-2 text-center text-xs font-semibold whitespace-nowrap ${balance > 0 ? "text-red-600" : "text-green-600"}`}>
                                            {balance.toLocaleString()}
                                        </td>

                                        {/* Status */}
                                        <td className="px-1.5 py-2 text-center">
                                            <span
                                                className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-semibold whitespace-nowrap capitalize ${status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : status === "partial"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-1.5 py-2">
                                            <div className="flex justify-center items-center gap-0.5">

                                                <button
                                                    type="button"
                                                    onClick={() => onView && onView(order)}
                                                    className="p-1 rounded-md hover:bg-blue-100 text-blue-600 transition"
                                                    title="View"
                                                >
                                                    <FiEye size={12} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onEdit && onEdit(order)}
                                                    className="p-1 rounded-md hover:bg-green-100 text-green-600 transition"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={12} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onDelete && onDelete(order)}
                                                    className="p-1 rounded-md hover:bg-red-100 text-red-600 transition"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={12} />
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

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalOrders}
                itemsPerPage={ordersPerPage}
                itemName="orders"
                onPageChange={onPageChange}
            />

        </div>
    );
}

export default OrderTable;