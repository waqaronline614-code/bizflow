import { useMemo, useState } from "react";
import { usePartyBalances } from "../../hooks/reports/UsePartyBalance";
import { money } from "../../utils/reportHelpers";

export default function BalanceReport({ config, title, partyLabel, totalLabel }) {
  const { rows, loading, error } = usePartyBalances(config);
  const [search, setSearch] = useState("");
  const [showZero, setShowZero] = useState(false);

  const visible = useMemo(
    () =>
      rows.filter(
        (r) =>
          (showZero || Math.abs(r.balance) > 0.005) &&
          r.name.toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search, showZero]
  );

  const totals = useMemo(
    () =>
      visible.reduce(
        (t, r) => ({
          billed: t.billed + r.billed,
          paid: t.paid + r.paid,
          balance: t.balance + r.balance,
          current: t.current + r.current,
          mid: t.mid + r.mid,
          old: t.old + r.old,
        }),
        { billed: 0, paid: 0, balance: 0, current: 0, mid: 0, old: 0 }
      ),
    [visible]
  );

  const owing = visible.filter((r) => r.balance > 0.005).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-gray-500">As of {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">{totalLabel}</p>
          <p className="text-2xl font-semibold mt-1">{money(totals.balance)}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">{partyLabel}s with a balance</p>
          <p className="text-2xl font-semibold mt-1">{owing}</p>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <p className="text-sm text-gray-500">Overdue by more than 60 days</p>
          <p className="text-2xl font-semibold mt-1 text-red-600">{money(totals.old)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${partyLabel.toLowerCase()}`}
          className="border rounded-md px-3 py-2 text-sm w-64 bg-white"
        />
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={showZero} onChange={(e) => setShowZero(e.target.checked)} />
          Show settled accounts
        </label>
      </div>

      {loading && <p className="text-gray-500">Loading report...</p>}
      {error && <p className="text-red-600">Could not load the report: {error.message}</p>}

      {!loading && !error && (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">{partyLabel}</th>
                <th className="px-4 py-3 font-medium text-right">Total billed</th>
                <th className="px-4 py-3 font-medium text-right">Paid</th>
                <th className="px-4 py-3 font-medium text-right">Balance</th>
                <th className="px-4 py-3 font-medium text-right">0-30 days</th>
                <th className="px-4 py-3 font-medium text-right">31-60 days</th>
                <th className="px-4 py-3 font-medium text-right">Over 60 days</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No outstanding balances.
                  </td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3 text-right">{money(r.billed)}</td>
                  <td className="px-4 py-3 text-right">{money(r.paid)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.balance < 0 ? "text-green-600" : ""}`}>
                    {money(r.balance)}
                  </td>
                  <td className="px-4 py-3 text-right">{money(r.current)}</td>
                  <td className="px-4 py-3 text-right">{money(r.mid)}</td>
                  <td className={`px-4 py-3 text-right ${r.old > 0 ? "text-red-600" : ""}`}>{money(r.old)}</td>
                  <td className="px-4 py-3 text-gray-500">{r.lastDate.getTime() ? r.lastDate.toLocaleDateString() : "-"}</td>
                </tr>
              ))}
            </tbody>
            {visible.length > 0 && (
              <tfoot className="border-t bg-gray-50 font-semibold">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-right">{money(totals.billed)}</td>
                  <td className="px-4 py-3 text-right">{money(totals.paid)}</td>
                  <td className="px-4 py-3 text-right">{money(totals.balance)}</td>
                  <td className="px-4 py-3 text-right">{money(totals.current)}</td>
                  <td className="px-4 py-3 text-right">{money(totals.mid)}</td>
                  <td className="px-4 py-3 text-right">{money(totals.old)}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">
        A negative balance (green) means an advance or overpayment. Payments are applied to the oldest invoices first.
      </p>
    </div>
  );
}