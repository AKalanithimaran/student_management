import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        placeholder="Search by name or email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-border bg-white py-3 pl-11 pr-4 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-100"
      />
    </div>
  );
};

export default SearchBar;
