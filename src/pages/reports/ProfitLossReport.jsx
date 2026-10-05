import { useMemo, useState } from "react";
import DateRangeFilter, { PRESETS } from "../../components/reports/DateRangeFilter";
import { useProfitLoss } from "../../hooks/reports/Useprofitloss";

const money = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

function Row({ label, value, bold, negative }) {
  return (
    <div className={`flex justify-between py-2 ${bold ? "font-semibold border-t" : ""}`}>
      <span>{label}</span>
      <span className={negative ? "text-red-600" : ""}>{money(value)}</span>
    </div>
  );
}

export default function ProfitLossReport() {
  const [range, setRange] = useState(() => PRESETS["This month"]());
  const [from, to] = range;
  const { data, loading, error } = useProfitLoss(from, to);

  const categories = useMemo(
    () => Object.entries(data?.byCategory || {}).sort((a, b) => b[1] - a[1]),
    [data]
  );

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50 space-y-6">
      <h1 className="text-2xl font-semibold">Profit &amp; Loss</h1>
      <DateRangeFilter onChange={(f, t) => setRange([f, t])} />

      {loading && <p className="text-gray-500">Loading report...</p>}
      {error && <p className="text-red-600">Could not load the report: {error.message}</p>}

      {data && !loading && (
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500 mb-3">
            {from.toLocaleDateString()} to {to.toLocaleDateString()} · {data.orderCount} sales orders
          </p>
          <Row label="Sales revenue" value={data.revenue} />
          <Row label="Cost of goods sold" value={data.cogs} />
          <Row label="Gross profit" value={data.grossProfit} bold />
          <div className="mt-3">
            <Row label="Total expenses" value={data.totalExpenses} />
            {categories.map(([name, amt]) => (
              <div key={name} className="flex justify-between pl-4 py-1 text-sm text-gray-600">
                <span>{name}</span>
                <span>{money(amt)}</span>
              </div>
            ))}
          </div>
          <Row label="Net profit" value={data.netProfit} bold negative={data.netProfit < 0} />
        </div>
      )}
    </div>
  );
}