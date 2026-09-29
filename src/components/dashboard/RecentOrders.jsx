// components/dashboard/RecentOrders.jsx  (props: orders = [{id, number, customer, date, items, total}], loading)
import { money } from "../../utils/dashboardUtils";

function RecentOrders({ orders = [], loading }) {
  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Recent Orders</h2>
      <p className="text-xs text-slate-400">Latest activity</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="py-2 pr-4 font-medium">Order</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Items</th>
              <th className="py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-slate-400">No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-slate-100 text-slate-700">
                  <td className="py-2 pr-4 font-medium">{o.number}</td>
                  <td className="py-2 pr-4">{o.customer}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {o.date ? o.date.toLocaleDateString() : "—"}
                  </td>
                  <td className="py-2 pr-4">{o.items}</td>
                  <td className="py-2 text-right font-medium whitespace-nowrap">{money(o.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;