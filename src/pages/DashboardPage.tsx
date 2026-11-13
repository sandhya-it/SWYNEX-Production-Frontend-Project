import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarClock,
  Clock,
  Compass,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '../components/applications/StatusBadge';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { AnalyticsChart } from '../components/dashboard/AnalyticsChart';
import { EmptyState } from '../components/dashboard/EmptyState';
import { StatCard } from '../components/dashboard/StatCard';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetails } from '../components/jobs/JobDetails';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useCareer } from '../context/CareerContext';
import { useJobs } from '../hooks/useJobs';
import { APPLICATION_STATUSES, RemotiveJob } from '../types/career';
import { formatDate, formatDateTime, getInterviewCountdown } from '../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { applications, interviews, activities, savedJobs } = useCareer();
  const { jobs, loading: jobsLoading, error: jobsError, retry } = useJobs(12);
  const [selectedJob, setSelectedJob] = useState<RemotiveJob | null>(null);

  const stats = useMemo(() => {
    const total = applications.length;
    const inReview = applications.filter(
      (a) => a.status === 'Under Review' || a.status === 'Shortlisted'
    ).length;
    const interviewApps = applications.filter((a) => a.status === 'Interview Scheduled').length;
    const upcomingInterviewsCount = interviews.filter((i) => !i.completed).length;
    const offers = applications.filter((a) => a.status === 'Offer Received').length;

    return {
      total,
      inReview,
      interviewsValue: upcomingInterviewsCount > 0 ? upcomingInterviewsCount : interviewApps,
      upcomingInterviewsCount,
      interviewApps,
      offers,
    };
  }, [applications, interviews]);

  const statusChartData = useMemo(
    () =>
      APPLICATION_STATUSES.map((status) => ({
        status,
        count: applications.filter((a) => a.status === status).length,
      })),
    [applications]
  );

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5),
    [applications]
  );

  const upcomingInterviews = useMemo(
    () =>
      interviews
        .filter((iv) => !iv.completed)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
        .slice(0, 4),
    [interviews]
  );

  const recommendedJobs = useMemo(() => jobs.slice(0, 4), [jobs]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome Back!"
        subtitle="Here's your career progress at a glance."
        actions={
          <>
            <Link to="/jobs">
              <Button variant="outline" leftIcon={<Compass className="h-4 w-4" />}>
                Find Jobs
              </Button>
            </Link>
            <Link to="/applications?new=1">
              <Button leftIcon={<Plus className="h-4 w-4" />}>Add Application</Button>
            </Link>
          </>
        }
      />

      {/* 4 Statistic Cards */}
      <section aria-label="Career statistics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={stats.total}
            helperText={stats.total === 0 ? 'No applications logged yet' : `${savedJobs.length} jobs bookmarked`}
            icon={<Briefcase className="h-4 w-4" />}
          />
          <StatCard
            label="Applications in Review"
            value={stats.inReview}
            helperText="Under Review & Shortlisted"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            label="Interviews Scheduled"
            value={stats.interviewsValue}
            helperText={`${stats.upcomingInterviewsCount} upcoming calendar rounds`}
            icon={<CalendarClock className="h-4 w-4" />}
          />
          <StatCard
            label="Offers Received"
            value={stats.offers}
            helperText={
              stats.total > 0
                ? `${Math.round((stats.offers / stats.total) * 100)}% offer conversion`
                : 'Log applications to track offers'
            }
            icon={<Award className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Chart + Quick Actions & Reminders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Application Status Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribution across all six pipeline stages
              </p>
            </div>
            <Link
              to="/analytics"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>Full Analytics</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-5 w-5" />}
              title="No application pipeline data yet"
              description="Add your first application manually or import an opportunity from Find Jobs to populate your status chart."
              action={
                <Link to="/jobs">
                  <Button size="sm">Explore Remote Jobs</Button>
                </Link>
              }
            />
          ) : (
            <AnalyticsChart data={statusChartData} height={260} />
          )}
        </section>

        <section className="space-y-6 lg:col-span-5">
          {/* Quick Actions */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="mt-3.5 grid grid-cols-2 gap-2.5">
              <Link
                to="/jobs"
                className="rounded-lg border border-slate-200 px-3.5 py-3 text-left text-xs font-medium text-slate-800 transition-colors hover:border-blue-600 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              >
                Explore Jobs
              </Link>
              <Link
                to="/applications?new=1"
                className="rounded-lg border border-slate-200 px-3.5 py-3 text-left text-xs font-medium text-slate-800 transition-colors hover:border-blue-600 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              >
                Log Application
              </Link>
              <Link
                to="/interviews?new=1"
                className="rounded-lg border border-slate-200 px-3.5 py-3 text-left text-xs font-medium text-slate-800 transition-colors hover:border-blue-600 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              >
                Schedule Interview
              </Link>
              <Link
                to="/saved"
                className="rounded-lg border border-slate-200 px-3.5 py-3 text-left text-xs font-medium text-slate-800 transition-colors hover:border-blue-600 hover:bg-blue-50/40 dark:border-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
              >
                Review Saved ({savedJobs.length})
              </Link>
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                Upcoming Interviews
              </h2>
              <Link
                to="/interviews"
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View All
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No upcoming interviews scheduled. Add interview reminders in the Interview Tracker.
              </p>
            ) : (
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {upcomingInterviews.map((iv) => {
                  const countdown = getInterviewCountdown(iv.dateTime);
                  return (
                    <li key={iv.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {iv.companyName} · {iv.round}
                        </p>
                        <p className="truncate text-xs text-slate-500 tabular-nums dark:text-slate-400">
                          {iv.position} · {formatDateTime(iv.dateTime)}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-xs font-medium text-blue-600 tabular-nums dark:text-blue-400">
                        {countdown.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Recent Applications + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Recent Applications
            </h2>
            <Link
              to="/applications"
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Manage All
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Start tracking roles you have applied to and monitor follow-up dates."
              action={
                <Link to="/applications?new=1">
                  <Button size="sm">Add First Application</Button>
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0 hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {app.jobTitle}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {app.companyName} · {app.location} ·{' '}
                      <span className="tabular-nums">{formatDate(app.appliedDate)}</span>
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 font-display text-base font-semibold text-slate-900 dark:text-white">
            Recent Activity Timeline
          </h2>
          <ActivityTimeline activities={activities} limit={6} />
        </section>
      </div>

      {/* Recommended Opportunities from Remotive */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Recommended Opportunities
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remote roles sourced from Remotive (public feed may be delayed up to 24h)
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            <span>Explore All Listings</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {jobsLoading && <LoadingSkeleton variant="card" count={2} />}
        {!jobsLoading && jobsError && (
          <ErrorMessage
            title="Could not load Remotive opportunities"
            message={jobsError}
            onRetry={retry}
          />
        )}
        {!jobsLoading && !jobsError && recommendedJobs.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recommendedJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
            ))}
          </div>
        )}
      </section>

      <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
};
