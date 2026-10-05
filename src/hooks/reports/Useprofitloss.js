import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 
import { num, pick, findDate } from "../../utils/Reporthelpers";

const read = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));

export function useProfitLoss(from, to) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [o, p, e] = await Promise.all(
          ["orders", "purchases", "expenses"].map((n) => getDocs(collection(db, n)))
        );
        const orders = read(o), purchases = read(p), expenses = read(e);

        // Average purchase cost per product (all purchases, not just the range)
        const cost = {};
        purchases.forEach((pu) =>
          (pu.items || []).forEach((i) => {
            const qty = num(pick(i, ["quantity", "qty"]));
            const price = num(pick(i, ["purchasePrice", "price"]));
            const c = (cost[i.productId] ||= { qty: 0, total: 0 });
            c.qty += qty;
            c.total += qty * price;
          })
        );
        const avgCost = (id) => (cost[id]?.qty ? cost[id].total / cost[id].qty : 0);

        const inRange = (doc, dateFields) => {
          const x = findDate(doc, dateFields);
          return x >= from && x <= to;
        };

        const rangeOrders = orders.filter((d) => inRange(d, ["orderDate", "date"]));
        const rangeExpenses = expenses.filter((d) => inRange(d, ["expenseDate", "date"]));

        const orderTotal = (x) => {
          const t = pick(x, ["grandTotal", "totalAmount", "total"]);
          if (t !== undefined) return num(t);
          return (x.items || []).reduce((s, i) => s + num(i.amount), 0);
        };

        const revenue = rangeOrders.reduce((s, x) => s + orderTotal(x), 0);
        const cogs = rangeOrders.reduce(
          (s, x) =>
            s + (x.items || []).reduce((t, i) => t + num(pick(i, ["quantity", "qty"])) * avgCost(i.productId), 0),
          0
        );

        const byCategory = {};
        rangeExpenses.forEach((x) => {
          const k = pick(x, ["category", "expenseCategory"]) || "Uncategorized";
          byCategory[k] = (byCategory[k] || 0) + num(pick(x, ["amount", "totalAmount"]));
        });
        const totalExpenses = Object.values(byCategory).reduce((a, b) => a + b, 0);

        const grossProfit = revenue - cogs;
        if (!cancelled)
          setData({
            revenue, cogs, grossProfit, totalExpenses,
            netProfit: grossProfit - totalExpenses,
            byCategory, orderCount: rangeOrders.length,
          });
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [from, to]);

  return { data, loading, error };
}