import { Link } from "react-router-dom";

const reports = [
  { to: "/reports/profit-loss", title: "Profit & Loss", desc: "Revenue, cost of goods, expenses, and net profit for a period", ready: true },
  { to: "/reports/receivables", title: "Customer balances", desc: "Who owes you money and for how long", ready: true },
  { to: "/reports/payables", title: "Supplier balances", desc: "What you owe each supplier", ready: true },
  { to: "/reports/stock", title: "Stock", desc: "Quantity and value per product, low-stock flags", ready: true },
  { to: "/reports/sales", title: "Sales", desc: "Orders by date, customer, and product", ready: true },
  { to: "/reports/purchases", title: "Purchases", desc: "Purchases by date, supplier, and product", ready: true },
  { to: "/reports/expenses", title: "Expenses", desc: "Spending by category and date" },
  { to: "/reports/cash-flow", title: "Cash & bank", desc: "Balances and money in vs. out per account" },
];

export default function ReportsHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Reports</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) =>
          r.ready ? (
            <Link key={r.to} to={r.to} className="block bg-white border rounded-lg p-4 hover:border-blue-500">
              <h2 className="font-medium">{r.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{r.desc}</p>
            </Link>
          ) : (
            <div key={r.to} className="bg-gray-50 border border-dashed rounded-lg p-4 text-gray-500">
              <h2 className="font-medium">{r.title}</h2>
              <p className="text-sm mt-1">{r.desc}</p>
              <p className="text-xs mt-2">Coming soon</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}