function Pagination() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 bg-white">

      {/* Left */}

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold">1</span> to{" "}
        <span className="font-semibold">4</span> of{" "}
        <span className="font-semibold">4</span> customers
      </p>

      {/* Right */}

      <div className="flex items-center gap-2">

        <button
          className="px-4 py-2 rounded-lg border border-slate-300
          text-slate-600 hover:bg-slate-100 transition"
        >
          Previous
        </button>

        <button
          className="w-10 h-10 rounded-lg bg-blue-600
          text-white font-semibold"
        >
          1
        </button>

        <button
          className="px-4 py-2 rounded-lg border border-slate-300
          text-slate-600 hover:bg-slate-100 transition"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Pagination;