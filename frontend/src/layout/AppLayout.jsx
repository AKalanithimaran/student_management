import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutGrid,
  Menu,
  Users
} from 'lucide-react';
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import Tooltip from '../components/Tooltip.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/analytics', label: 'Reports', icon: BarChart3 }
];

const AppLayout = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="relative h-screen overflow-hidden bg-surface text-text dark:bg-[#0F172A] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 w-[95%] rounded-[40px] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl" />
      <div className="mx-auto flex h-screen w-full max-w-none gap-6 px-0 py-0">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col gap-6 border-r border-border bg-card/95 p-4 shadow-2xl backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#334155] dark:bg-[#1E293B] lg:static lg:translate-x-0 lg:rounded-3xl lg:border lg:shadow-lg ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isSidebarExpanded ? 'w-56 items-stretch' : 'w-20 items-center'}`}
        >
          <div className={`flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                <GraduationCap size={20} />
              </div>
              {isSidebarExpanded && (
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Academy</p>
                  <p className="text-sm font-semibold text-text dark:text-slate-100">Students CRM</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsSidebarExpanded((prev) => !prev)}
              className="hidden rounded-full border border-border bg-white p-1 text-slate-500 shadow-sm transition hover:border-primary hover:text-primary dark:border-[#334155] dark:bg-[#0F172A] lg:inline-flex"
            >
              {isSidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          <nav className={`flex flex-1 flex-col gap-2 ${isSidebarExpanded ? '' : 'items-center'}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center rounded-2xl transition ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#22314a]'
                    } ${isSidebarExpanded ? 'gap-3 px-3 py-2.5' : 'h-11 w-11 justify-center'}`
                  }
                >
                  {isSidebarExpanded ? (
                    <>
                      <Icon size={18} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </>
                  ) : (
                    <Tooltip label={item.label}>
                      <Icon size={18} />
                    </Tooltip>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className={`flex flex-col gap-2 pb-2 ${isSidebarExpanded ? '' : 'items-center'}`}>
            <DarkModeToggle compact={!isSidebarExpanded} theme={theme} onToggle={toggleTheme} />
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col min-h-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card/90 p-3 shadow-sm backdrop-blur dark:border-[#334155] dark:bg-[#1E293B] lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-white p-2 text-slate-500 shadow-sm transition hover:border-primary hover:text-primary dark:border-[#334155] dark:bg-[#0F172A]"
            >
              <Menu size={18} />
            </button>
            <DarkModeToggle compact theme={theme} onToggle={toggleTheme} />
          </div>
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-3xl border border-border bg-card/90 shadow-lg backdrop-blur transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#334155] dark:bg-[#1E293B] lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 lg:p-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <Toaster position="top-right" />
      {isSidebarOpen && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
