import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

const orders = [
  {
    id: "#1001",
    customer: "Ali Khan",
    status: "Paid",
    amount: "$250",
    date: "28 Jul",
  },
  {
    id: "#1002",
    customer: "Ahmad",
    status: "Pending",
    amount: "$120",
    date: "27 Jul",
  },
  {
    id: "#1003",
    customer: "Bilal",
    status: "Cancelled",
    amount: "$350",
    date: "26 Jul",
  },
  {
    id: "#1004",
    customer: "Waqar Shah",
    status: "Paid",
    amount: "$620",
    date: "25 Jul",
  },
];

function RecentOrders() {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Orders
        </h2>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
          View All
        </button>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-200">

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Order ID
              </th>

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Customer
              </th>

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Status
              </th>

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Amount
              </th>

              <th className="text-left py-3 text-sm font-semibold text-slate-500">
                Date
              </th>

              <th className="text-center py-3 text-sm font-semibold text-slate-500">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >

                <td className="py-4 font-semibold text-slate-800">
                  {order.id}
                </td>

                <td className="py-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {getInitials(order.customer)}
                    </div>

                    <div>

                      <p className="font-medium text-slate-800">
                        {order.customer}
                      </p>

                      <p className="text-xs text-slate-500">
                        Customer
                      </p>

                    </div>

                  </div>

                </td>

                <td className="py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="py-4 font-semibold text-slate-800">
                  {order.amount}
                </td>

                <td className="py-4 text-slate-500">
                  {order.date}
                </td>

                <td className="py-4">

                  <div className="flex items-center justify-center gap-2">

                    <button
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      title="View"
                    >
                      <FiEye size={18} />
                    </button>

                    <button
                      className="p-2 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>

                    <button
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
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

    </div>
  );
}

export default RecentOrders;