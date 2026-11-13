import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, SearchX } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/dashboard/EmptyState';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetails } from '../components/jobs/JobDetails';
import { JobFilters } from '../components/jobs/JobFilters';
import { JobSearchBar } from '../components/jobs/JobSearchBar';
import { PageHeader } from '../components/layout/PageHeader';
import { useJobs } from '../hooks/useJobs';
import { RemotiveJob } from '../types/career';
import { formatRelativeTime } from '../utils/formatters';

const PAGE_SIZE = 10;

export const FindJobsPage: React.FC = () => {
  const {
    jobs,
    loading,
    error,
    fromCache,
    lastFetchedAt,
    filters,
    setFilters,
    categories,
    jobTypes,
    searchHistory,
    submitSearch,
    retry,
    resetFilters,
  } = useJobs(60);

  const [selectedJob, setSelectedJob] = useState<RemotiveJob | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return jobs.slice(start, start + PAGE_SIZE);
  }, [jobs, currentPage]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find Remote Jobs"
        subtitle="Discover remote engineering, product, design, and internship opportunities sourced from Remotive."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={retry}
            disabled={loading}
            leftIcon={<RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh Feed
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <span>
          Job Source:{' '}
          <a
            href="https://remotive.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline underline-offset-2 dark:text-blue-400"
          >
            Remotive Public Remote Jobs API
          </a>{' '}
          · Public listings may be delayed up to 24 hours.
        </span>
        {lastFetchedAt && (
          <span className="font-mono tabular-nums">
            {fromCache ? 'Cached' : 'Updated'} {formatRelativeTime(new Date(lastFetchedAt).toISOString())}
          </span>
        )}
      </div>

      <JobSearchBar
        value={filters.search}
        onChange={(search) => setFilters((prev) => ({ ...prev, search }))}
        onSubmit={submitSearch}
        searchHistory={searchHistory}
        loading={loading}
      />

      <JobFilters
        filters={filters}
        categories={categories}
        jobTypes={jobTypes}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {loading && <LoadingSkeleton variant="card" count={6} />}

      {!loading && error && (
        <ErrorMessage
          title="Unable to fetch remote opportunities"
          message={error}
          onRetry={retry}
        />
      )}

      {!loading && !error && jobs.length === 0 && (
        <EmptyState
          icon={<SearchX className="h-5 w-5" />}
          title="No matching opportunities found."
          description="Try broadening your keywords, switching categories, or resetting your active filters."
          action={
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          }
        />
      )}

      {!loading && !error && paginatedJobs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="tabular-nums">
              Showing {jobs.length} matching {jobs.length === 1 ? 'opportunity' : 'opportunities'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={jobs.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}

      <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
};
