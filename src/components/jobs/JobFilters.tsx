import React from 'react';
import { RotateCcw } from 'lucide-react';
import { JobSearchFilters } from '../../types/career';
import { formatJobTypeLabel } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';

export interface JobFiltersProps {
  filters: JobSearchFilters;
  categories: string[];
  jobTypes: string[];
  onChange: (next: JobSearchFilters) => void;
  onReset: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  categories,
  jobTypes,
  onChange,
  onReset,
}) => {
  const hasActiveFilters =
    filters.category !== 'All' ||
    filters.jobType !== 'All' ||
    filters.remoteOnly ||
    filters.location.trim() !== '' ||
    filters.sortBy !== 'newest' ||
    filters.search.trim() !== '';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Select
          label="Category"
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          options={categories.map((cat) => ({ label: cat, value: cat }))}
        />

        <Select
          label="Job Type"
          value={filters.jobType}
          onChange={(e) => onChange({ ...filters, jobType: e.target.value })}
          options={jobTypes.map((jt) => ({
            label: jt === 'All' ? 'All Types' : formatJobTypeLabel(jt),
            value: jt,
          }))}
        />

        <Input
          label="Location"
          placeholder="e.g. USA, Europe, Worldwide"
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        />

        <Select
          label="Sort By"
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as JobSearchFilters['sortBy'],
            })
          }
          options={[
            { label: 'Newest First', value: 'newest' },
            { label: 'Oldest First', value: 'oldest' },
            { label: 'Title (A–Z)', value: 'title_asc' },
            { label: 'Company (A–Z)', value: 'company_asc' },
          ]}
        />

        <div className="flex flex-col justify-end gap-2">
          <label className="flex min-h-10 items-center gap-2.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 cursor-pointer dark:border-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={filters.remoteOnly}
              onChange={(e) => onChange({ ...filters, remoteOnly: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span className="whitespace-nowrap">Worldwide / Anywhere</span>
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
