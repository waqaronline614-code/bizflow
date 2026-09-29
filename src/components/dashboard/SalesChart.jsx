// components/dashboard/SalesChart.jsx  (props: data = [{label, value}], loading)
import { compact, money } from "../../utils/dashboardUtils";

function SalesChart({ data = [], loading }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm h-full">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Sales Overview</h2>
          <p className="text-xs text-slate-400">Revenue, last 6 months</p>
        </div>
        <p className="text-xs font-medium text-slate-600">{money(total)}</p>
      </div>

      {loading ? (
        <p className="py-16 text-center text-xs text-slate-400">Loading…</p>
      ) : total === 0 ? (
        <p className="py-16 text-center text-xs text-slate-400">No sales in this period yet.</p>
      ) : (
        <div className="mt-4 flex h-44 items-end gap-3">
          {data.map((d) => (
            <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[10px] text-slate-500" title={money(d.value)}>
                {d.value ? compact(d.value) : ""}
              </span>
              <div
                className="w-full rounded-t-md bg-blue-500/80 transition-all"
                style={{ height: `${Math.max((d.value / max) * 100, d.value ? 4 : 1)}%` }}
                title={money(d.value)}
              />
              <span className="text-[11px] text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SalesChart;