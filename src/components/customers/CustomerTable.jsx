import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";

function CustomerTable({
    customers,
    onEditCustomer,
    onDeleteCustomer,
    currentPage,
    totalPages,
    totalCustomers,
    customersPerPage,
    onPageChange,
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-200">

                <select
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Customers</option>
                    <option>Retail</option>
                    <option>Wholesale</option>
                    <option>VIP</option>
                </select>

                <select
                    className="h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
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

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                    {/* Header */}
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Name
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Phone
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                                Email
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

                        {customers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="py-10 text-center text-sm text-slate-500"
                                >
                                    No customers added yet.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
                                >

                                    {/* Name */}
                                    <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">
                                        {customer.fullName}
                                    </td>

                                    {/* Phone */}
                                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                        {customer.phone}
                                    </td>

                                    {/* Email */}
                                    <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                                        {customer.email}
                                    </td>

                                    {/* Status */}
                                    <td className="px-3 py-3 text-center whitespace-nowrap">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold ${
                                                customer.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {customer.status}
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
                                                    onEditCustomer(customer)
                                                }
                                                className="p-1.5 rounded-lg hover:bg-green-100 text-green-600 transition"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>

                                            {/* Delete */}
                                            <button
                                                onClick={() =>
                                                    onDeleteCustomer(customer)
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
                totalItems={totalCustomers}
                itemsPerPage={customersPerPage}
                itemName="customers"
                onPageChange={onPageChange}
            />

        </div>
    );
}

export default CustomerTable;