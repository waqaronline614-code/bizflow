// utils/dashboardUtils.js
// All the field names the dashboard reads live in the "FIELD MAPPING" block.
// If a number looks wrong, this is the only place to change.

export const CURRENCY = "Rs "; // change to "$", "PKR " etc.
export const money = (n) => `${CURRENCY}${Number(n || 0).toLocaleString()}`;
export const compact = (n) =>
  new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n || 0);

export const toDate = (v) => {
  if (!v) return null;
  if (typeof v.toDate === "function") return v.toDate(); // Firestore Timestamp
  const d = new Date(v);
  return isNaN(d) ? null : d;
};

export const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const growthLabel = (current, previous) => {
  if (!previous) return current > 0 ? "New" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
};

// ---------------- FIELD MAPPING ----------------
export const orderDate = (o) => toDate(o.date ?? o.orderDate ?? o.createdAt);
export const orderItems = (o) => (Array.isArray(o.items) ? o.items : []);
export const itemQty = (i) => Number(i.quantity ?? i.qty ?? 0);
export const itemPrice = (i) => Number(i.price ?? i.salePrice ?? i.unitPrice ?? 0);
export const itemName = (i) => i.productName ?? i.name ?? "Unknown product";
export const itemKey = (i) => i.productId ?? i.productName ?? i.name ?? i.id;
export const orderCustomerId = (o) => o.customerId ?? o.customer;
export const orderNumber = (o) => o.orderNo || `#${String(o.id).slice(0, 6)}`;
export const customerName = (c) => c.fullName ?? c.name ?? "Unnamed";
export const productName = (p) => p.productName ?? p.name ?? "Unnamed";
export const lowStockLimit = (p) =>
  Number(p.lowStockAlert ?? p.reorderLevel ?? p.minStock ?? p.minimumStock ?? 10);

export const orderTotal = (o) => {
  const direct = o.totalAmount ?? o.total ?? o.grandTotal ?? o.netTotal;
  if (direct !== undefined && direct !== null && direct !== "") return Number(direct) || 0;
  return orderItems(o).reduce(
    (s, i) => s + (Number(i.subtotal ?? i.total) || itemQty(i) * itemPrice(i)),
    0
  );
};
// ------------------------------------------------

const nameOfCustomer = (o, customerMap) => {
  const c = customerMap.get(orderCustomerId(o));
  return c ? customerName(c) : o.customerName || "Walk-in customer";
};

export const buildCustomerMap = (customers) => new Map(customers.map((c) => [c.id, c]));

// Revenue for the last N months, oldest first
export const monthlySales = (orders, months = 6) => {
  const now = new Date();
  const buckets = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: monthKey(d),
      label: d.toLocaleString("en", { month: "short" }),
      value: 0,
    });
  }
  orders.forEach((o) => {
    const d = orderDate(o);
    if (!d) return;
    const b = buckets.find((x) => x.key === monthKey(d));
    if (b) b.value += orderTotal(o);
  });
  return buckets;
};

export const topCustomers = (orders, customers, n = 5) => {
  const map = buildCustomerMap(customers);
  const totals = new Map();
  orders.forEach((o) => {
    const key = orderCustomerId(o) ?? nameOfCustomer(o, map);
    const prev = totals.get(key) || { name: nameOfCustomer(o, map), total: 0, orders: 0 };
    prev.total += orderTotal(o);
    prev.orders += 1;
    totals.set(key, prev);
  });
  return [...totals.values()].sort((a, b) => b.total - a.total).slice(0, n);
};

export const topProducts = (orders, n = 5) => {
  const totals = new Map();
  orders.forEach((o) =>
    orderItems(o).forEach((i) => {
      const key = itemKey(i);
      const prev = totals.get(key) || { name: itemName(i), qty: 0, revenue: 0 };
      prev.qty += itemQty(i);
      prev.revenue += Number(i.subtotal ?? i.total) || itemQty(i) * itemPrice(i);
      totals.set(key, prev);
    })
  );
  return [...totals.values()].sort((a, b) => b.qty - a.qty).slice(0, n);
};

export const lowStockProducts = (products, n = 8) =>
  products
    .filter((p) => Number(p.stock || 0) <= lowStockLimit(p))
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, n);

export const recentOrders = (orders, customers, n = 6) => {
  const map = buildCustomerMap(customers);
  return [...orders]
    .sort((a, b) => (orderDate(b)?.getTime() || 0) - (orderDate(a)?.getTime() || 0))
    .slice(0, n)
    .map((o) => ({
      id: o.id,
      number: orderNumber(o),
      customer: nameOfCustomer(o, map),
      date: orderDate(o),
      items: orderItems(o).length,
      total: orderTotal(o),
    }));
};