import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";
import { useEffect, useState } from "react";
import { getPurchase } from "../../services/purchaseService";

function ProductTable({
    products,
    onEditProduct,
    onDeleteProduct,
    currentPage,
    totalPages,
    totalProducts,
    productsPerPage,
    onPageChange,
}) {
    // stockByProductId maps a product's id -> total quantity purchased
    // across all purchase records (aggregated from each purchase's line items).
    const [stockByProductId, setStockByProductId] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStock = async () => {
            try {
                setIsLoading(true);
                const purchases = await getPurchase();

                const stockMap = {};

                purchases.forEach((purchase) => {
                    const items = purchase.items || [];

                    items.forEach((item) => {
                        const productId = item.productId;
                        const quantity = Number(item.quantity) || 0;

                        if (!productId) return;

                        stockMap[productId] =
                            (stockMap[productId] || 0) + quantity;
                    });
                });

                setStockByProductId(stockMap);
            } catch (error) {
                console.error("Failed to fetch purchases:", error);
                setError("Failed to load stock data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStock();
    }, []);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-200">

                <select
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Products</option>
                    <option>Retail</option>
                    <option>Wholesale</option>
                    <option>VIP</option>
                </select>

                <select
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                </select>

                <select
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                </select>

            </div>

            {/* Error */}
            {error && (
                <div className="mx-4 mt-4 px-4 py-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full min-w-[850px]">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Product Name
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Category
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Purchase Price
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Selling Price
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Stock
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Status
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Actions
                            </th>

                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>

                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    Loading products...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    No Products added yet.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => {

                                // Prefer live purchase-derived stock; fall back
                                // to a stock field on the product itself if present.
                                const currentStock =
                                    stockByProductId[product.id] ??
                                    product.stock ??
                                    0;

                                const status =
                                    currentStock > 0
                                        ? "In Stock"
                                        : "Out of Stock";

                                return (
                                    <tr
                                        key={product.id}
                                        className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
                                    >

                                        {/* Product Name */}
                                        <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                                            {product.productName}
                                        </td>

                                        {/* Category */}
                                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                            {product.category}
                                        </td>

                                        {/* Purchase Price */}
                                        <td className="px-3 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                            Rs. {product.purchasePrice}
                                        </td>

                                        {/* Selling Price */}
                                        <td className="px-3 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                            Rs. {product.sellingPrice}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-3 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                            {currentStock} {product.unit}
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-3 text-center whitespace-nowrap">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${status === "In Stock"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-3 py-3">
                                            <div className="flex justify-center items-center gap-1">

                                                {/* View */}
                                                <button
                                                    className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                                                >
                                                    <FiEye size={16} />
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={() =>
                                                        onEditProduct(product)
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition"
                                                >
                                                    <FiEdit2 size={16} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() =>
                                                        onDeleteProduct(product)
                                                    }
                                                    className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                                                >
                                                    <FiTrash2 size={16} />
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
                totalItems={totalProducts}
                itemsPerPage={productsPerPage}
                itemName="products"
                onPageChange={onPageChange}
            />

        </div>
    );
}

export default ProductTable;