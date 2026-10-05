import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts } from "../../services/productService";
import { getPurchase } from "../../services/purchaseService"
import { num, pick } from "../../utils/Reporthelpers";

export function useStockReport(defaultReorderLevel = 10) {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [prods, purs] = await Promise.all([getProducts(), getPurchase()]);
      setProducts(prods);
      setPurchases(purs);
    } catch (err) {
      console.error("Failed to load stock report:", err);
      setError("Failed to load stock report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const rows = useMemo(() => {
    // Weighted average purchase cost per product
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

    const order = { out: 0, low: 1, ok: 2 };

    return products
      .map((p) => {
        const stock = num(p.stock);
        const c = cost[p.id];
        const avgCost = c?.qty
          ? c.total / c.qty
          : num(pick(p, ["purchasePrice", "costPrice"])); // fallback if never purchased
        const reorderLevel =
          num(pick(p, ["reorderLevel", "minStock", "lowStockLevel"])) ||
          defaultReorderLevel;

        const status = stock <= 0 ? "out" : stock <= reorderLevel ? "low" : "ok";

        return {
          id: p.id,
          name: pick(p, ["name", "productName", "title"]) || "Unnamed product",
          sku: pick(p, ["sku", "code"]) || "",
          stock,
          avgCost,
          value: stock * avgCost,
          reorderLevel,
          status,
        };
      })
      .sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));
  }, [products, purchases, defaultReorderLevel]);

  const totals = useMemo(
    () => ({
      products: rows.length,
      units: rows.reduce((s, r) => s + r.stock, 0),
      value: rows.reduce((s, r) => s + r.value, 0),
      low: rows.filter((r) => r.status === "low").length,
      out: rows.filter((r) => r.status === "out").length,
    }),
    [rows]
  );

  return { rows, totals, isLoading, error, refetch };
}