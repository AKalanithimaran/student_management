import { SlidersHorizontal } from 'lucide-react';

const AgeFilter = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <SlidersHorizontal className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-2xl border border-border bg-white py-3 pl-11 pr-10 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
      >
        <option value="all">All Ages</option>
        <option value="0-18">0-18</option>
        <option value="19-25">19-25</option>
        <option value="26-40">26-40</option>
        <option value="40+">40+</option>
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">▾</span>
    </div>
  );
};

export default AgeFilter;
