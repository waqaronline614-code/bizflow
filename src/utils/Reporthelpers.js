
export const toDate = (v) => (v?.toDate ? v.toDate() : new Date(v));
export const num = (v) => Number(v) || 0;
export const money = (n) =>
  Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

export const pick = (obj, keys) => {
  for (const k of [].concat(keys)) {
    const v = obj?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return undefined;
};

export const findDate = (obj, keys) => {
  const v = pick(obj, keys);
  if (v) return toDate(v);
  for (const val of Object.values(obj || {})) {
    if (val?.toDate) return val.toDate();
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) return new Date(val);
  }
  return new Date(NaN);
};

// Downloads an array of flat objects as a CSV file
export function downloadCSV(filename, rows) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => esc(r[c])).join(",")),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Safe version of toDate: returns null instead of an Invalid Date
export const asDate = (v) => {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v.toDate === "function") return v.toDate();
  if (v instanceof Date) return isNaN(v) ? null : v;
  if (typeof v === "object" && "seconds" in v) return new Date(v.seconds * 1000);

  if (typeof v === "string") {
    // DD/MM/YYYY or DD-MM-YYYY
    const m = v.trim().match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  }

  const d = new Date(v);
  return isNaN(d) ? null : d;
};

// "YYYY-MM-DD" key for grouping by day
export const dayKey = (v) => {
  const d = asDate(v);
  return d ? d.toISOString().slice(0, 10) : "No date";
};

// from / to are "YYYY-MM-DD" strings (either can be empty)
export const inRange = (v, from, to) => {
  const d = asDate(v);
  if (!d) return !from && !to;
  if (from && d < new Date(from + "T00:00:00")) return false;
  if (to && d > new Date(to + "T23:59:59.999")) return false;
  return true;
};

export const itemKey = (it) => it?.productId || it?.productName || "unknown";