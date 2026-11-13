import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, BarChart3, Briefcase, CalendarClock, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../components/common/Button';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { EmptyState } from '../components/dashboard/EmptyState';
import { StatCard } from '../components/dashboard/StatCard';
import { PageHeader } from '../components/layout/PageHeader';
import { useCareer } from '../context/CareerContext';
import { APPLICATION_STATUSES } from '../types/career';

const PIE_COLORS = ['#2563eb', '#0b162c', '#4f46e5', '#0284c7', '#16a34a', '#d97706'];

export const CareerAnalyticsPage: React.FC = () => {
  const { applications, interviews, isDark } = useCareer();

  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';

  const metrics = useMemo(() => {
    const total = applications.length;
    if (total === 0) {
      return {
        total: 0,
        interviewConversionRate: '—',
        offerRate: '—',
        activePipelineCount: 0,
      };
    }

    const reachedInterview = applications.filter(
      (a) =>
        a.status === 'Interview Scheduled' ||
        a.status === 'Offer Received'
    ).length;

    // Also include applications linked to scheduled interviews
    const appIdsWithInterviews = new Set(
      interviews.map((iv) => iv.applicationId).filter((id): id is string => Boolean(id))
    );
    const totalInterviewApps = applications.filter(
      (a) =>
        a.status === 'Interview Scheduled' ||
        a.status === 'Offer Received' ||
        appIdsWithInterviews.has(a.id)
    ).length;

    const offers = applications.filter((a) => a.status === 'Offer Received').length;
    const active = applications.filter((a) => a.status !== 'Rejected').length;

    return {
      total,
      interviewConversionRate: `${Math.round((Math.max(reachedInterview, totalInterviewApps) / total) * 100)}%`,
      offerRate: `${Math.round((offers / total) * 100)}%`,
      activePipelineCount: active,
    };
  }, [applications, interviews]);

  const statusData = useMemo(
    () =>
      APPLICATION_STATUSES.map((status) => ({
        status,
        count: applications.filter((a) => a.status === status).length,
      })),
    [applications]
  );

  const categoryData = useMemo(() => {
    const counts = new Map<string, number>();
    applications.forEach((app) => {
      const cat = app.category?.trim() || 'General';
      counts.set(cat, (counts.get(cat) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [applications]);

  const monthlyTrendData = useMemo(() => {
    const map = new Map<string, { month: string; applications: number; interviews: number }>();

    applications.forEach((app) => {
      const d = new Date(app.appliedDate);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(d);
      const current = map.get(key) || { month: label, applications: 0, interviews: 0 };
      current.applications += 1;
      map.set(key, current);
    });

    interviews.forEach((iv) => {
      const d = new Date(iv.dateTime);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(d);
      const current = map.get(key) || { month: label, applications: 0, interviews: 0 };
      current.interviews += 1;
      map.set(key, current);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  }, [applications, interviews]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Analytics"
        subtitle="Metrics and pipeline insights calculated strictly from your stored application and interview records."
      />

      {applications.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No analytics available yet"
          description="Conversion rates, category breakdowns, and monthly trends require at least one tracked application. Start by adding an application or importing a role from Find Jobs."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/jobs">
                <Button variant="outline">Find Remote Jobs</Button>
              </Link>
              <Link to="/applications?new=1">
                <Button>Add First Application</Button>
              </Link>
            </div>
          }
        />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Applications"
              value={metrics.total}
              helperText={`${metrics.activePipelineCount} active in pipeline`}
              icon={<Briefcase className="h-4 w-4" />}
            />
            <StatCard
              label="Interview Conversion Rate"
              value={metrics.interviewConversionRate}
              helperText="Applications reaching interview stage"
              icon={<CalendarClock className="h-4 w-4" />}
            />
            <StatCard
              label="Offer Rate"
              value={metrics.offerRate}
              helperText="Applications resulting in an offer"
              icon={<Award className="h-4 w-4" />}
            />
            <StatCard
              label="Logged Interviews"
              value={interviews.length}
              helperText={`${interviews.filter((i) => i.completed).length} completed`}
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Bar Chart: Applications by Status */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Applications by Status
              </h2>
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                Current headcount across all six pipeline stages
              </p>
              <AnalyticsChart data={statusData} height={280} />
            </section>

            {/* Pie Chart: Most Applied Categories */}
            <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Most Frequently Applied Categories
              </h2>
              <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                Breakdown by role category
              </p>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={82}
                      innerRadius={45}
                      paddingAngle={2}
                    >
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        borderRadius: '0.625rem',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          {/* Line Chart: Monthly Application Activity & Trends */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Monthly Application Activity &amp; Trends
            </h2>
            <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
              Applications submitted and interview rounds logged per month
            </p>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData} margin={{ top: 8, right: 16, left: -12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: tickColor, fontSize: 12 }}
                    axisLine={{ stroke: gridColor }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: tickColor, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#334155' : '#e2e8f0',
                      borderRadius: '0.625rem',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    name="Applications"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="interviews"
                    name="Interviews"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
