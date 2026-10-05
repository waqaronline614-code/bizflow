import { useState } from "react";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const endOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const PRESETS = {
  "This month": () => {
    const n = new Date();
    return [new Date(n.getFullYear(), n.getMonth(), 1), endOfDay(n)];
  },
  "Last month": () => {
    const n = new Date();
    return [new Date(n.getFullYear(), n.getMonth() - 1, 1), endOfDay(new Date(n.getFullYear(), n.getMonth(), 0))];
  },
  "This year": () => {
    const n = new Date();
    return [new Date(n.getFullYear(), 0, 1), endOfDay(n)];
  },
};

export default function DateRangeFilter({ onChange }) {
  const [active, setActive] = useState("This month");
  const [custom, setCustom] = useState({ from: "", to: "" });

  const pick = (name) => {
    setActive(name);
    const [f, t] = PRESETS[name]();
    onChange(f, t);
  };

  const applyCustom = () => {
    if (!custom.from || !custom.to) return;
    setActive("Custom");
    onChange(startOfDay(new Date(custom.from)), endOfDay(new Date(custom.to)));
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      {Object.keys(PRESETS).map((name) => (
        <button
          key={name}
          onClick={() => pick(name)}
          className={`px-3 py-1.5 rounded-md text-sm border ${
            active === name ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {name}
        </button>
      ))}
      <div className="flex items-end gap-2">
        <input type="date" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="border rounded-md px-2 py-1.5 text-sm" />
        <input type="date" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="border rounded-md px-2 py-1.5 text-sm" />
        <button onClick={applyCustom} className={`px-3 py-1.5 rounded-md text-sm border ${active === "Custom" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50"}`}>
          Apply
        </button>
      </div>
    </div>
  );
}