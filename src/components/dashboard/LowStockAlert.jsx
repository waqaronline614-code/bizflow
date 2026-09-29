// components/dashboard/LowStockAlert.jsx  (props: products = low-stock products, loading)
import { productName, lowStockLimit } from "../../utils/dashboardUtils";

function LowStockAlert({ products = [], loading }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Low Stock Alert</h2>
          <p className="text-xs text-slate-400">Products running out</p>
        </div>
        {products.length > 0 && (
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
            {products.length}
          </span>
        )}
      </div>

      {loading ? (
        <p className="py-8 text-center text-xs text-slate-400">Loading…</p>
      ) : products.length === 0 ? (
        <p className="py-8 text-center text-xs text-emerald-600">All products are well stocked.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-100">
          {products.map((p) => {
            const stock = Number(p.stock || 0);
            return (
              <li key={p.id} className="flex items-center justify-between gap-3 py-2 text-xs">
                <span className="min-w-0 flex-1 break-words font-medium text-slate-700">
                  {productName(p)}
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    stock === 0 ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {stock === 0 ? "Out of stock" : `${stock} left`}
                </span>
                <span className="sr-only">alert level {lowStockLimit(p)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LowStockAlert;