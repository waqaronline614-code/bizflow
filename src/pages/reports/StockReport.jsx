import { useState } from "react";
import { Link } from "react-router-dom";
import { useStockReport } from "../../hooks/reports/useStockReport";
import { money, downloadCSV } from "../../utils/Reporthelpers";

const STATUS = {
  ok: { label: "In stock", cls: "bg-green-100 text-green-700" },
  low: { label: "Low stock", cls: "bg-amber-100 text-amber-700" },
  out: { label: "Out of stock", cls: "bg-red-100 text-red-700" },
};

export default function StockReport() {
  const [threshold, setThreshold] = useState(10);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | attention | low | out

  const { rows, totals, isLoading, error, refetch } = useStockReport(threshold);

  const visible = rows.filter((r) => {
    const matches = `${r.name} ${r.sku}`.toLowerCase().includes(search.toLowerCase());
    const byStatus =
      filter === "all" ||
      (filter === "attention" && r.status !== "ok") ||
      r.status === filter;
    return matches && byStatus;
  });

  const exportCSV = () =>
    downloadCSV(
      "stock-report.csv",
      visible.map((r) => ({
        Product: r.name,
        SKU: r.sku,
        Quantity: r.stock,
        "Avg Cost": Math.round(r.avgCost),
        Value: Math.round(r.value),
        "Reorder Level": r.reorderLevel,
        Status: STATUS[r.status].label,
      }))
    );

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/reports" className="text-sm text-blue-600 hover:underline">
            ← Reports
          </Link>
          <h1 className="text-2xl font-semibold">Stock Report</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Refresh
          </button>
          <button onClick={exportCSV} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Export CSV
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Products" value={totals.products} />
        <Card label="Total units" value={totals.units} />
        <Card label="Stock value" value={money(totals.value)} />
        <Card
          label="Need attention"
          value={`${totals.low} low · ${totals.out} out`}
          tone={totals.low + totals.out ? "text-red-600" : ""}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product or SKU..."
          className="border rounded-lg px-3 py-2 text-sm w-64"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All products</option>
          <option value="attention">Low + out of stock</option>
          <option value="low">Low stock only</option>
          <option value="out">Out of stock only</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          Low-stock level
          <input
            type="number"
            min="0"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value) || 0)}
            className="border rounded-lg px-2 py-2 text-sm w-20"
          />
        </label>
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium text-right">Quantity</th>
              <th className="px-4 py-3 font-medium text-right">Avg cost</th>
              <th className="px-4 py-3 font-medium text-right">Value</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
            )}
            {!isLoading && !visible.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No products found</td></tr>
            )}
            {!isLoading &&
              visible.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    {r.name}
                    {r.sku && <span className="block text-xs text-gray-500">{r.sku}</span>}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">{r.stock}</td>
                  <td className="px-4 py-3 text-right">{money(r.avgCost)}</td>
                  <td className="px-4 py-3 text-right">{money(r.value)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS[r.status].cls}`}>
                      {STATUS[r.status].label}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
          {!isLoading && !!visible.length && (
            <tfoot className="border-t bg-gray-50 font-medium">
              <tr>
                <td className="px-4 py-3">Total ({visible.length})</td>
                <td className="px-4 py-3 text-right">{visible.reduce((s, r) => s + r.stock, 0)}</td>
                <td />
                <td className="px-4 py-3 text-right">{money(visible.reduce((s, r) => s + r.value, 0))}</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

const Card = ({ label, value, tone = "" }) => (
  <div className="border rounded-xl p-4 bg-white">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-xl font-semibold ${tone}`}>{value}</p>
  </div>
);