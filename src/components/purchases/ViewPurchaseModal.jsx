import { FiX, FiPackage, FiCalendar } from "react-icons/fi";

function ViewPurchaseModal({ purchase, supplier, onClose }) {
    if (!purchase) return null;

    // Make sure items is always an array
    const items = Array.isArray(purchase.items)
        ? purchase.items
        : [];

    // Total quantity
    const totalQuantity = items.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    // Total purchase amount
    const totalAmount = items.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
    );

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";

        const formattedDate = new Date(date);

        if (Number.isNaN(formattedDate.getTime())) {
            return date;
        }

        return formattedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Format number
    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString();
    };

    // Payment status
    const paymentStatus = purchase.paymentStatus?.toLowerCase();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}
        >

            {/* Modal */}
            <div
                className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ================= HEADER ================= */}

                <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-slate-200 shrink-0">

                    <div className="min-w-0">

                        <h2 className="text-lg md:text-xl font-bold text-slate-800">
                            Purchase Details
                        </h2>

                        <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">

                            <span className="truncate">
                                {supplier?.supplierName || "Unknown Supplier"}
                            </span>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition shrink-0"
                    >
                        <FiX size={20} />
                    </button>

                </div>


                {/* ================= SCROLLABLE CONTENT ================= */}

                <div className="flex-1 overflow-y-auto">

                    {/* ================= PURCHASE INFORMATION ================= */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-6 bg-slate-50 border-b border-slate-200">

                        {/* Supplier */}

                        <div className="min-w-0">

                            <p className="text-xs text-slate-500 mb-1">
                                Supplier
                            </p>

                            <p className="font-semibold text-sm text-slate-800 truncate">
                                {supplier?.supplierName || "-"}
                            </p>

                        </div>


                        {/* Purchase Date */}

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Purchase Date
                            </p>

                            <div className="flex items-center gap-1.5">

                                <FiCalendar
                                    size={14}
                                    className="text-slate-400"
                                />

                                <p className="font-semibold text-sm text-slate-800">
                                    {formatDate(purchase.purchaseDate)}
                                </p>

                            </div>

                        </div>


                        {/* Payment Status */}

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Payment Status
                            </p>

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                    paymentStatus === "paid"
                                        ? "bg-green-100 text-green-700"
                                        : paymentStatus === "partial"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                }`}
                            >
                                {purchase.paymentStatus || "Unpaid"}
                            </span>

                        </div>


                        {/* Total Products */}

                        <div>

                            <p className="text-xs text-slate-500 mb-1">
                                Total Products
                            </p>

                            <div className="flex items-center gap-1.5">

                                <FiPackage
                                    size={14}
                                    className="text-slate-400"
                                />

                                <p className="font-semibold text-sm text-slate-800">
                                    {items.length}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ================= PRODUCTS ================= */}

                    <div className="p-5 md:p-6">

                        <div className="flex items-center justify-between mb-3">

                            <div>

                                <h3 className="text-sm font-semibold text-slate-700">
                                    Purchased Products
                                </h3>

                                <p className="text-xs text-slate-500 mt-1">
                                    {items.length} product
                                    {items.length !== 1 ? "s" : ""} ·{" "}
                                    {totalQuantity} total quantity
                                </p>

                            </div>

                        </div>


                        {/* Empty products */}

                        {items.length === 0 ? (

                            <div className="border border-slate-200 rounded-xl py-10 text-center">

                                <FiPackage
                                    size={28}
                                    className="mx-auto text-slate-300 mb-2"
                                />

                                <p className="text-sm text-slate-500">
                                    No products found in this purchase.
                                </p>

                            </div>

                        ) : (

                            <div className="border border-slate-200 rounded-xl overflow-hidden">

                                <div className="max-h-[45vh] overflow-y-auto">

                                    <table className="w-full min-w-[650px]">

                                        {/* Table Header */}

                                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">

                                            <tr>

                                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">
                                                    Product
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                                                    Quantity
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                                                    Unit
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600">
                                                    Purchase Price
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">
                                                    Amount
                                                </th>

                                            </tr>

                                        </thead>


                                        {/* Table Body */}

                                        <tbody>

                                            {items.map((item) => (

                                                <tr
                                                    key={item.id}
                                                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                                                >

                                                    {/* Product */}

                                                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                                                        {item.productName || "-"}
                                                    </td>


                                                    {/* Quantity */}

                                                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                                                        {formatNumber(item.quantity)}
                                                    </td>


                                                    {/* Unit */}

                                                    <td className="px-4 py-3 text-center text-sm text-slate-600">
                                                        {item.unit || "-"}
                                                    </td>


                                                    {/* Purchase Price */}

                                                    <td className="px-4 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                                        Rs.{" "}
                                                        {formatNumber(
                                                            item.purchasePrice
                                                        )}
                                                    </td>


                                                    {/* Amount */}

                                                    <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800 whitespace-nowrap">
                                                        Rs.{" "}
                                                        {formatNumber(
                                                            item.amount
                                                        )}
                                                    </td>

                                                </tr>

                                            ))}

                                        </tbody>


                                        {/* ================= TOTAL ================= */}

                                        <tfoot className="bg-slate-50 border-t border-slate-200">

                                            <tr>

                                                <td className="px-4 py-3 text-sm font-bold text-slate-800">
                                                    Total
                                                </td>

                                                <td className="px-4 py-3 text-center text-sm font-bold text-slate-800">
                                                    {formatNumber(totalQuantity)}
                                                </td>

                                                <td></td>

                                                <td></td>

                                                <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 whitespace-nowrap">
                                                    Rs.{" "}
                                                    {formatNumber(totalAmount)}
                                                </td>

                                            </tr>

                                        </tfoot>

                                    </table>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* ================= FOOTER ================= */}

                <div className="flex items-center justify-end px-5 md:px-6 py-4 border-t border-slate-200 shrink-0 bg-white">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 transition"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ViewPurchaseModal;