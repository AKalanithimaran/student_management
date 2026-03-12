const StatCard = ({ label, value, icon: Icon, accent }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card dark:border-[#334155] dark:bg-[#1E293B]">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-2xl font-semibold text-text dark:text-slate-100">{value}</p>
        {Icon && (
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}>
            <Icon size={18} />
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
