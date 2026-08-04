import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import Pagination from "../common/Pagination";
import { useState } from "react";



function CustomerTable({customers}) {


  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Filters */}

      <div className="flex flex-wrap items-center gap-3 p-6 border-b border-slate-200">

        <select
          className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option>All Customers</option>
          <option>Retail</option>
          <option>Wholesale</option>
          <option>VIP</option>
        </select>

        <select
          className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select
          className="h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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

          {/* Header */}

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Phone
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Email
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>

            </tr>

          </thead>

          {/* Body */}

          <tbody>

            {customers.map((customer) => (

              <tr
                key={customer.id}
                className="border-b border-slate-100 hover:bg-blue-50 transition-colors duration-200"
              >

                <td className="px-6 py-4 font-medium text-slate-800">
                  {customer.name}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {customer.phone}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {customer.email}
                </td>

                <td className="px-6 py-4 text-center">

                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {customer.status}
                  </span>

                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center items-center gap-2">

                    <button
                      className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                      title="View"
                    >
                      <FiEye size={18} />
                    </button>

                    <button
                      className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
              <Pagination/>
    </div>
  );
}

export default CustomerTable;