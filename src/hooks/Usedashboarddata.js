// hooks/useDashboardData.js
import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";
import { getOrders } from "../services/orderService";

export default function useDashboardData() {
  const [data, setData] = useState({ customers: [], products: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [customers, products, orders] = await Promise.all([
          getCustomers(),
          getProducts(),
          getOrders(),
        ]);
        if (!cancelled) setData({ customers, products, orders });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        if (!cancelled) setError("Couldn't load some dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { ...data, loading, error };
}