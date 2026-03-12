import { Moon, Sun } from 'lucide-react';

const DarkModeToggle = ({ theme, onToggle, compact = false }) => {
  const isDark = theme === 'dark';

  if (compact) {
    return (
      <button
        onClick={onToggle}
        aria-label="Toggle dark mode"
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-white text-slate-600 shadow-sm transition hover:border-primary hover:text-primary dark:border-[#334155] dark:bg-[#0F172A] dark:text-slate-200"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="relative inline-flex h-10 w-[84px] items-center rounded-full border border-border bg-white px-1 shadow-sm transition hover:border-primary dark:border-[#334155] dark:bg-[#0F172A]"
    >
      <span
        className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-primary shadow-sm transition-transform ${
          isDark ? 'translate-x-[40px]' : 'translate-x-0'
        }`}
      />
      <span className={`relative z-10 flex h-8 w-8 items-center justify-center ${isDark ? 'text-slate-400' : 'text-white'}`}>
        <Sun size={16} />
      </span>
      <span className={`relative z-10 flex h-8 w-8 items-center justify-center ${isDark ? 'text-white' : 'text-slate-400'}`}>
        <Moon size={16} />
      </span>
    </button>
  );
};

export default DarkModeToggle;
