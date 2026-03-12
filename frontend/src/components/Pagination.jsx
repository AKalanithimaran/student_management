const Pagination = ({ page, totalPages, onPageChange }) => {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const pages = Array.from({ length: safeTotalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-border px-3 py-1 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-slate-300"
      >
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`rounded-lg px-3 py-1 text-sm ${
            p === page
              ? 'bg-primary text-white'
              : 'border border-border text-slate-700 dark:border-[#334155] dark:text-slate-200'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === safeTotalPages}
        className="rounded-lg border border-border px-3 py-1 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:text-slate-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
