function Pagination({
  currentPage,
  totalPages,
  totalCustomers,
  customersPerPage,
  onPageChange,
}) {
  const start = totalCustomers === 0 ? 0 : (currentPage - 1) * customersPerPage + 1;

  const end = Math.min(currentPage * customersPerPage, totalCustomers);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-t border-slate-200 bg-white">

      {/* Left */}

      <p className="text-sm text-slate-500">
        Showing <span className="font-semibold">{start}</span> to{" "}
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{totalCustomers}</span> customers
      </p>

      {/* Right */}

      <div className="flex items-center gap-2">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border border-slate-300
          text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`w-10 h-10 rounded-lg font-semibold transition
              ${currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border border-slate-300
          text-slate-600 hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Pagination;