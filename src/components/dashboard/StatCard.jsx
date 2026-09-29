// Stat card. Props: title, value, growth (optional, like "+12%"), icon,
//   accent ("blue" | "green" | "violet" | "rose" | "amber"),
//   invertGrowth (true when "up" is bad, e.g. expenses)
const ACCENTS = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  violet: "bg-violet-50 text-violet-600",
  rose: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
};

function StatCard({ title, value, growth, icon, accent = "blue", invertGrowth = false }) {
  let growthStyle = "bg-slate-100 text-slate-500";
  if (growth && growth.startsWith("+")) {
    growthStyle = invertGrowth ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600";
  } else if (growth && growth.startsWith("-")) {
    growthStyle = invertGrowth ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600";
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="break-words text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-1.5 break-words text-lg font-bold leading-snug text-slate-800">{value}</p>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${ACCENTS[accent] || ACCENTS.blue}`}>
          {icon}
        </div>
      </div>

      {growth && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${growthStyle}`}>
            {growth}
          </span>
          <span className="text-[11px] text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;