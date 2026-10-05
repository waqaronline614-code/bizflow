import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"
import { toDate, num } from "../../utils/reportHelpers";

const pick = (obj, keys) => {
  for (const k of [].concat(keys)) if (obj[k] !== undefined && obj[k] !== "") return obj[k];
  return undefined;
};

// Uses the configured date field; if it is missing, falls back to the first
// timestamp or "YYYY-MM-DD" string found on the document
const findDate = (obj, keys) => {
  const v = pick(obj, keys);
  if (v) return toDate(v);
  for (const val of Object.values(obj)) {
    if (val?.toDate) return val.toDate();
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) return new Date(val);
  }
  return new Date(0);
};

// Shared by Customer balances and Supplier balances.
export function usePartyBalances(config) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [inv, pay, par] = await Promise.all([
          getDocs(collection(db, config.invoiceCollection)),
          getDocs(collection(db, config.paymentCollection)),
          getDocs(collection(db, config.partyCollection)),
        ]);
        const invoices = inv.docs.map((d) => ({ id: d.id, ...d.data() }));
        const payments = pay.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((x) => x.type === config.paymentType);

        // Party names, keyed by document id
        const names = {};
        par.docs.forEach((d) => {
          names[d.id] = pick(d.data(), config.partyNameFields) || "Unknown";
        });

        const parties = {};
        const ensure = (id) =>
          (parties[id] ||= { id, name: names[id] || "Unknown", invoices: [], paid: 0 });

        invoices.forEach((i) => {
          const id = pick(i, config.invoicePartyId);
          if (!id) return;
          ensure(id).invoices.push({
            date: findDate(i, config.dateField || "date"),
            total: config.getTotal ? config.getTotal(i) : num(pick(i, config.totalField)),
          });
        });
        // Payments also count for parties with no invoices (advances)
        payments.forEach((x) => {
          if (x.partyId && (parties[x.partyId] || names[x.partyId])) ensure(x.partyId).paid += num(x.amount);
        });

        const now = new Date();
        const result = Object.values(parties).map((p) => {
          const billed = p.invoices.reduce((s, i) => s + i.total, 0);
          const balance = billed - p.paid;

          // Apply payments to the oldest invoices first, then age what's left
          let credit = p.paid;
          const aging = { current: 0, mid: 0, old: 0 };
          [...p.invoices]
            .sort((a, b) => a.date - b.date)
            .forEach((i) => {
              const applied = Math.min(credit, i.total);
              credit -= applied;
              const open = i.total - applied;
              if (open <= 0) return;
              const days = (now - i.date) / 86400000;
              if (days <= 30) aging.current += open;
              else if (days <= 60) aging.mid += open;
              else aging.old += open;
            });

          const last = p.invoices.reduce((m, i) => (i.date > m ? i.date : m), new Date(0));
          return { id: p.id, name: p.name, billed, paid: p.paid, balance, ...aging, lastDate: last };
        });

        if (!cancelled) setRows(result.sort((a, b) => b.balance - a.balance));
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [config]);

  return { rows, loading, error };
}