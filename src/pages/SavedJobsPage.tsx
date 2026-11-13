import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Compass, Search } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { EmptyState } from '../components/dashboard/EmptyState';
import { JobCard } from '../components/jobs/JobCard';
import { JobDetails } from '../components/jobs/JobDetails';
import { PageHeader } from '../components/layout/PageHeader';
import { useSavedJobs } from '../hooks/useSavedJobs';
import { RemotiveJob } from '../types/career';

export const SavedJobsPage: React.FC = () => {
  const { savedJobs } = useSavedJobs();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<RemotiveJob | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    savedJobs.forEach((j) => {
      if (j.category) set.add(j.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, [savedJobs]);

  const filteredSaved = useMemo(() => {
    const q = search.trim().toLowerCase();
    return savedJobs.filter((job) => {
      if (categoryFilter !== 'All' && job.category !== categoryFilter) return false;
      if (q) {
        const hay = `${job.title} ${job.company_name} ${job.candidate_required_location} ${job.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [savedJobs, search, categoryFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Jobs"
        subtitle="Review bookmarked remote roles, inspect requirements, and move opportunities into My Applications."
        actions={
          <Link to="/jobs">
            <Button variant="outline" leftIcon={<Compass className="h-4 w-4" />}>
              Find More Jobs
            </Button>
          </Link>
        }
      />

      {savedJobs.length > 0 && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
          <div className="sm:col-span-8">
            <Input
              label="Search Saved Jobs"
              placeholder="Search saved titles, companies, or skills..."
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:col-span-4">
            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={categories.map((c) => ({ label: c, value: c }))}
            />
          </div>
        </div>
      )}

      {savedJobs.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title="No saved jobs yet"
          description="Bookmark remote roles while browsing Find Jobs to compare requirements and apply when you are ready."
          action={
            <Link to="/jobs">
              <Button leftIcon={<Compass className="h-4 w-4" />}>Explore Opportunities</Button>
            </Link>
          }
        />
      ) : filteredSaved.length === 0 ? (
        <EmptyState
          title="No saved jobs match your filters"
          description="Adjust your search query or reset the category selector."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredSaved.map((job) => (
            <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
          ))}
        </div>
      )}

      <JobDetails job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
};
