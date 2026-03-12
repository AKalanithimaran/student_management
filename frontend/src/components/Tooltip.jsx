const Tooltip = ({ label, children }) => {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </span>
  );
};

export default Tooltip;
