import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";

function SupplierTable({
    suppliers,
    onEditSupplier,
    onDeleteSupplier,
    currentPage,
    totalPages,
    totalSuppliers,
    suppliersPerPage,
    onPageChange,
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Supplier Name
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Contact Person
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Phone
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Address
                            </th>

                            <th className="px-3 py-3 text-center text-xs font-semibold text-slate-700">
                                Actions
                            </th>

                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>

                        {suppliers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    No Suppliers added yet.
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier) => (
                                <tr
                                    key={supplier.id}
                                    className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
                                >

                                    {/* Supplier Name */}
                                    <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                                        {supplier.supplierName}
                                    </td>

                                    {/* Contact Person */}
                                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                        {supplier.contactPerson}
                                    </td>

                                    {/* Phone */}
                                    <td className="px-3 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                        {supplier.phone}
                                    </td>

                                    {/* Address */}
                                    <td className="px-3 py-3 text-center text-sm text-slate-600 whitespace-nowrap">
                                        {supplier.address}
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
                                                    onEditSupplier(supplier)
                                                }
                                                className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    onDeleteSupplier(supplier)
                                                }
                                                className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalSuppliers}
                itemsPerPage={suppliersPerPage}
                itemName="suppliers"
                onPageChange={onPageChange}
            />

        </div>
    );
}

export default SupplierTable;