import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";

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
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Filters */}

            <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-200">

                <select
                    className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Products</option>
                    <option>Retail</option>
                    <option>Wholesale</option>
                    <option>VIP</option>
                </select>

                <select
                    className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Status</option>
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                </select>

                <select
                    className="h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Name (A-Z)</option>
                    <option>Name (Z-A)</option>
                </select>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-50 border-b border-slate-200">

                        <tr>

                            <th className="px-2 py-4 text-left text-sm font-semibold text-slate-700">
                                Product Name
                            </th>

                            <th className="px-2 py-4 text-left text-sm font-semibold text-slate-700">
                                Category
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Purchase Price
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Selling Price
                            </th>
                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Stock
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Status
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Actions
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {products.length === 0 ? (
                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-12 text-slate-500"
                                >
                                    No Products added yet.
                                </td>

                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
                                >

                                    <td className="px-2 py-4 font-medium text-slate-800">
                                        {product.productName}
                                    </td>

                                    <td className="px-2 py-4 text-slate-600">
                                        {product.category}
                                    </td>

                                    <td className="px-2 py-4 text-slate-600">
                                        {product.purchasePrice}
                                    </td>
                                    <td className="px-2 py-4 text-slate-600">
                                        {product.sellingPrice}
                                    </td>
                                    <td className="px-2 py-4 text-slate-600">
                                        {product.stock}
                                    </td>

                                    <td className="px-2 py-4 text-center">

                                        <span
                                            className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${product.status === "In Stock"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {product.status}
                                        </span>

                                    </td>

                                    <td className="px-2 py-4">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                                            >
                                                <FiEye size={18} />
                                            </button>

                                            <button
                                                onClick={() => onEditProduct(product)}
                                                className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                                            >
                                                <FiEdit2 size={18} />
                                            </button>

                                            <button
                                                onClick={() => onDeleteProduct(product)}
                                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

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