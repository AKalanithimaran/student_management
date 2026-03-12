const Badge = ({ variant, children }) => {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
  const map = {
    active: 'bg-success/10 text-success',
    pending: 'bg-warning/10 text-warning',
    blocked: 'bg-danger/10 text-danger'
  };

  return <span className={`${base} ${map[variant] || 'bg-slate-100 text-slate-700'}`}>{children}</span>;
};

export default Badge;
