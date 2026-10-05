import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { money, dayKey, inRange, downloadCSV } from "../../utils/Reporthelpers";

const fmtDate = (d) => (d ? d.toLocaleDateString("en-GB") : "—");

export default function TransactionReport({
  title, partyLabel, records, isLoading, error, refetch, fileName,
}) {
  const [view, setView] = useState("detail"); // detail | date | party | product
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      records
        .filter((r) => inRange(r.date, from, to))
        .filter((r) => `${r.no} ${r.party}`.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0)),
    [records, from, to, search]
  );

  const showPayments = filtered.some((r) => r.paid !== null);

  const summary = useMemo(() => {
    const total = filtered.reduce((s, r) => s + r.total, 0);
    return {
      count: filtered.length,
      total,
      avg: filtered.length ? total / filtered.length : 0,
      balance: filtered.reduce((s, r) => s + (r.balance || 0), 0),
    };
  }, [filtered]);

  // grouped rows for date / party / product views
  const grouped = useMemo(() => {
    if (view === "detail") return [];
    const map = {};
    const add = (key, ref, qty, total) => {
      map[key] ??= { name: key, refs: new Set(), qty: 0, total: 0 };
      map[key].refs.add(ref);
      map[key].qty += qty;
      map[key].total += total;
    };
    filtered.forEach((r) => {
      if (view === "date") add(dayKey(r.date), r.id, r.qty, r.total);
      else if (view === "party") add(r.party, r.id, r.qty, r.total);
      else r.lines.forEach((l) => add(l.productName, r.id, l.qty, l.amount));
    });
    return Object.values(map)
      .map((g) => ({ ...g, count: g.refs.size }))
      .sort((a, b) => (view === "date" ? b.name.localeCompare(a.name) : b.total - a.total));
  }, [filtered, view]);

  const groupLabel = { date: "Date", party: partyLabel, product: "Product" }[view];

  const exportCSV = () => {
    if (view === "detail") {
      downloadCSV(fileName, filtered.map((r) => ({
        Date: fmtDate(r.date), No: r.no, [partyLabel]: r.party, Quantity: r.qty,
        Total: Math.round(r.total),
        ...(showPayments && { Paid: Math.round(r.paid || 0), Balance: Math.round(r.balance || 0) }),
      })));
    } else {
      downloadCSV(fileName, grouped.map((g) => ({
        [groupLabel]: g.name, Transactions: g.count, Quantity: g.qty, Total: Math.round(g.total),
      })));
    }
  };

  const tabs = [
    ["detail", "All records"],
    ["date", "By date"],
    ["party", `By ${partyLabel.toLowerCase()}`],
    ["product", "By product"],
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/reports" className="text-sm text-blue-600 hover:underline">← Reports</Link>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={refetch} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">Refresh</button>
          <button onClick={exportCSV} className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">Export CSV</button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className={`grid grid-cols-2 gap-3 ${showPayments ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        <Card label="Records" value={summary.count} />
        <Card label="Total" value={money(summary.total)} />
        <Card label="Average per record" value={money(summary.avg)} />
        {showPayments && <Card label="Outstanding balance" value={money(summary.balance)} />}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border overflow-hidden bg-white">
          {tabs.map(([k, label]) => (
            <button key={k} onClick={() => setView(k)}
              className={`px-3 py-2 text-sm ${view === k ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        <span className="text-sm text-gray-500">to</span>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-lg px-3 py-2 text-sm" />
        {(from || to) && (
          <button onClick={() => { setFrom(""); setTo(""); }} className="text-sm underline">Clear dates</button>
        )}
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search number or ${partyLabel.toLowerCase()}...`}
          className="border rounded-lg px-3 py-2 text-sm w-64" />
      </div>

      <div className="overflow-x-auto border rounded-xl bg-white">
        {view === "detail" ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">No.</th>
                <th className="px-4 py-3 font-medium">{partyLabel}</th>
                <th className="px-4 py-3 font-medium text-right">Qty</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                {showPayments && <th className="px-4 py-3 font-medium text-right">Paid</th>}
                {showPayments && <th className="px-4 py-3 font-medium text-right">Balance</th>}
              </tr>
            </thead>
            <tbody>
              {isLoading && <Empty cols={7} text="Loading..." />}
              {!isLoading && !filtered.length && <Empty cols={7} text="No records in this range" />}
              {!isLoading && filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">{fmtDate(r.date)}</td>
                  <td className="px-4 py-3">{r.no}</td>
                  <td className="px-4 py-3">{r.party}</td>
                  <td className="px-4 py-3 text-right">{r.qty}</td>
                  <td className="px-4 py-3 text-right">{money(r.total)}</td>
                  {showPayments && <td className="px-4 py-3 text-right">{money(r.paid || 0)}</td>}
                  {showPayments && (
                    <td className={`px-4 py-3 text-right ${r.balance > 0 ? "text-red-600" : ""}`}>
                      {money(r.balance || 0)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            {!isLoading && !!filtered.length && (
              <tfoot className="border-t bg-gray-50 font-medium">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Total ({filtered.length})</td>
                  <td className="px-4 py-3 text-right">{filtered.reduce((s, r) => s + r.qty, 0)}</td>
                  <td className="px-4 py-3 text-right">{money(summary.total)}</td>
                  {showPayments && <td />}
                  {showPayments && <td className="px-4 py-3 text-right">{money(summary.balance)}</td>}
                </tr>
              </tfoot>
            )}
          </table>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">{groupLabel}</th>
                <th className="px-4 py-3 font-medium text-right">Transactions</th>
                <th className="px-4 py-3 font-medium text-right">Quantity</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <Empty cols={4} text="Loading..." />}
              {!isLoading && !grouped.length && <Empty cols={4} text="No records in this range" />}
              {!isLoading && grouped.map((g) => (
                <tr key={g.name} className="border-t">
                  <td className="px-4 py-3">{g.name}</td>
                  <td className="px-4 py-3 text-right">{g.count}</td>
                  <td className="px-4 py-3 text-right">{g.qty}</td>
                  <td className="px-4 py-3 text-right">{money(g.total)}</td>
                </tr>
              ))}
            </tbody>
            {!isLoading && !!grouped.length && (
              <tfoot className="border-t bg-gray-50 font-medium">
                <tr>
                  <td className="px-4 py-3" colSpan={3}>Total</td>
                  <td className="px-4 py-3 text-right">{money(grouped.reduce((s, g) => s + g.total, 0))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  );
}

const Card = ({ label, value }) => (
  <div className="border rounded-xl p-4 bg-white">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const Empty = ({ cols, text }) => (
  <tr><td colSpan={cols} className="px-4 py-8 text-center text-gray-500">{text}</td></tr>
);