function StatCard({ title, value, icon, growth }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        overflow-hidden
      "
    >
      <div className="h-1 bg-blue-600"></div>

      <div className="p-6">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-slate-500 text-sm">
              {title}
            </p>

            <h2 className="text-3xl font-bold mt-2 text-slate-900">
              {value}
            </h2>
          </div>

          <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl">
            {icon}
          </div>

        </div>

        <div className="mt-6 flex items-center gap-2">

          <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            ▲ {growth}
          </span>

          <span className="text-slate-400 text-sm">
            vs last month
          </span>

        </div>

      </div>

    </div>
  );
}

export default StatCard;