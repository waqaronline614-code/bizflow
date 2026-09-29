// components/dashboard/TopProducts.jsx  (props: data = [{name, qty, revenue}], loading)
import { money } from "../../utils/dashboardUtils";

function TopProducts({ data = [], loading }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-800">Top Selling Products</h2>
      <p className="text-xs text-slate-400">By quantity sold</p>

      {loading ? (
        <p className="py-8 text-center text-xs text-slate-400">Loading…</p>
      ) : data.length === 0 ? (
        <p className="py-8 text-center text-xs text-slate-400">No sales yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {data.map((p, i) => (
            <li key={`${p.name}-${i}`} className="flex items-center gap-3 py-2 text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 break-words font-medium text-slate-700">{p.name}</span>
              <div className="shrink-0 text-right">
                <p className="font-medium text-slate-700">{p.qty} sold</p>
                <p className="text-[10px] text-slate-400">{money(p.revenue)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TopProducts;