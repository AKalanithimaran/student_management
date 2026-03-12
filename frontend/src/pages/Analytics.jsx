import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, CalendarDays, Gauge, Sparkles, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getStudents } from '../services/api.js';
import socket from '../socket/socket.js';

const COLORS = ['#2563EB', '#0EA5E9', '#22C55E', '#F59E0B'];

const bucketizeAges = (students) => {
  const buckets = {
    '0-18': 0,
    '19-25': 0,
    '26-40': 0,
    '40+': 0
  };

  students.forEach((student) => {
    const age = Number(student.age);
    if (age <= 18) buckets['0-18'] += 1;
    else if (age <= 25) buckets['19-25'] += 1;
    else if (age <= 40) buckets['26-40'] += 1;
    else buckets['40+'] += 1;
  });

  return buckets;
};

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getStudents({ page: 1, limit: 0 });
      setStudents(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    const handleRefresh = () => fetchAnalytics();
    socket.on('studentAdded', handleRefresh);
    socket.on('studentUpdated', handleRefresh);
    socket.on('studentDeleted', handleRefresh);

    return () => {
      socket.off('studentAdded', handleRefresh);
      socket.off('studentUpdated', handleRefresh);
      socket.off('studentDeleted', handleRefresh);
    };
  }, [fetchAnalytics]);

  const totals = useMemo(() => {
    const total = students.length;
    const average = total
      ? Math.round(students.reduce((sum, s) => sum + Number(s.age || 0), 0) / total)
      : 0;
    const buckets = bucketizeAges(students);
    return { total, average, buckets };
  }, [students]);

  const cards = [
    { label: 'Total Students', value: totals.total, icon: Users, tone: 'from-blue-500/20 to-sky-400/20' },
    { label: 'Average Age', value: totals.average || '-', icon: Gauge, tone: 'from-violet-500/20 to-indigo-400/20' },
    { label: 'Active Cohorts', value: Object.keys(totals.buckets).length, icon: CalendarDays, tone: 'from-emerald-500/20 to-lime-400/20' },
    { label: 'Growth Signals', value: totals.total ? 'Stable' : '—', icon: BarChart3, tone: 'from-amber-500/20 to-orange-400/20' }
  ];

  const chartData = Object.entries(totals.buckets).map(([label, value]) => ({
    label,
    value
  }));

  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card/95 p-6 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br from-primary/20 via-sky-400/10 to-transparent blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-secondary">
              <Sparkles size={12} />
              Analytics
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-text dark:text-slate-100">
              Students Insights
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Real-time metrics that update instantly when students are added, edited, or deleted.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
            <Activity size={14} />
            Live Metrics
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-[#4C1D1D] dark:bg-[#2B1B1B] dark:text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-card/95 py-16 text-sm text-slate-500 dark:border-[#334155] dark:bg-[#1E293B] dark:text-slate-400">
          Loading analytics...
        </div>
      ) : (
        <div className="grid w-full gap-4 lg:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`rounded-2xl bg-gradient-to-br ${card.tone} p-[1px]`}
              >
                <div className="rounded-2xl border border-border bg-card/95 p-5 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="mt-4 text-2xl font-semibold text-text dark:text-slate-100">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text dark:text-slate-100">Age Distribution</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-[#1F2A44] dark:text-slate-300">
                Live
              </span>
            </div>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <RechartTooltip
                    cursor={{ fill: 'rgba(37,99,235,0.08)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1' }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/95 p-6 shadow-card backdrop-blur dark:border-[#334155] dark:bg-[#1E293B]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text dark:text-slate-100">Cohort Share</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-[#1F2A44] dark:text-slate-300">
                Live
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={52}
                      outerRadius={84}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #CBD5E1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                {chartData.map((entry, index) => (
                  <div key={entry.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.label}</span>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Analytics;
