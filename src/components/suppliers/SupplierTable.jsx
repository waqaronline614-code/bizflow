import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";



function SupplierTable({ suppliers, onEditSupplier, onDeleteSupplier,  currentPage,
    totalPages,
    totalSuppliers,
    suppliersPerPage,
    onPageChange, }) {
    return (
        <div className="bg-white rounded-2xl border
         border-slate-200 shadow-sm overflow-hidden">
            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-50 border-b border-slate-200">

                        <tr>

                            <th className="px-2 py-4 text-left text-sm font-semibold text-slate-700">
                                Supplier Name
                            </th>

                            <th className="px-2 py-4 text-left text-sm font-semibold text-slate-700">
                                Contact Person
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Phone
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Address
                            </th>

                            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
                                Actions
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {suppliers.length === 0 ? (
                            <tr>

                                <td
                                    colSpan="8"
                                    className="text-center py-12 text-slate-500"
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

                                    <td className="px-2 py-4 font-medium text-slate-800">
                                        {supplier.supplierName}
                                    </td>

                                    <td className="px-2 py-4 text-slate-600">
                                        {supplier.contactPerson}
                                    </td>

                                    <td className="px-2 py-4 text-slate-600">
                                        {supplier.phone}
                                    </td>
                                    <td className="px-2 py-4 text-slate-600">
                                        {supplier.address}
                                    </td>
                                    <td className="px-2 py-4">

                                        <div className="flex justify-center items-center gap-2">

                                            <button
                                                className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                                            >
                                                <FiEye size={18} />
                                            </button>

                                            <button

                                                className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                                                onClick={() => onEditSupplier(supplier)}
                                            >
                                                <FiEdit2 size={18} />
                                            </button>

                                            <button
                                                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                                                onClick={() => onDeleteSupplier(supplier)}
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
                totalItems={totalSuppliers}
                itemsPerPage={suppliersPerPage}
                itemName="suppliers"
                onPageChange={onPageChange}
            />
        </div>
    )
}


export default SupplierTable;