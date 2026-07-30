const customers = [
  {
    id: 1,
    name: "Ali Khan",
    email: "ali@gmail.com",
    orders: 12,
  },
  {
    id: 2,
    name: "Ahmad Ali",
    email: "ahmad@gmail.com",
    orders: 9,
  },
  {
    id: 3,
    name: "Waqar Shah",
    email: "waqar@gmail.com",
    orders: 16,
  },
  {
    id: 4,
    name: "Bilal",
    email: "bilal@gmail.com",
    orders: 7,
  },
];

function RecentCustomers() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Customers
        </h2>

        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View All
        </button>
      </div>

      <div className="space-y-5">

        {customers.map((customer) => (
          <div
            key={customer.id}
            className="flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg transition"
          >

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                {customer.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-medium text-slate-800">
                  {customer.name}
                </h3>

                <p className="text-sm text-slate-500">
                  {customer.email}
                </p>
              </div>

            </div>

            <span className="text-sm font-medium text-slate-600">
              {customer.orders} Orders
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default RecentCustomers;