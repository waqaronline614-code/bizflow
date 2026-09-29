// components/dashboard/TopCustomersChart.jsx  (props: data = [{name, total, orders}], loading)
import { money } from "../../utils/dashboardUtils";

function TopCustomersChart({ data = [], loading }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm h-full">
      <h2 className="text-sm font-semibold text-slate-800">Top Customers</h2>
      <p className="text-xs text-slate-400">By total order value</p>

      {loading ? (
        <p className="py-10 text-center text-xs text-slate-400">Loading…</p>
      ) : data.length === 0 ? (
        <p className="py-10 text-center text-xs text-slate-400">No orders yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.map((c, i) => (
            <li key={`${c.name}-${i}`}>
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="break-words font-medium text-slate-700">{c.name}</span>
                <span className="shrink-0 text-slate-500">{money(c.total)}</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-violet-500"
                  style={{ width: `${(c.total / max) * 100}%` }}
                />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                {c.orders} {c.orders === 1 ? "order" : "orders"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopCustomersChart;