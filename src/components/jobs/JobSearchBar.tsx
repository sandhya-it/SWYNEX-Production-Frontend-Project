import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '../common/Button';

export interface JobSearchBarProps {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: (searchTerm: string) => void;
  searchHistory: string[];
  loading?: boolean;
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  searchHistory,
  loading = false,
}) => {
  const [focused, setFocused] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="space-y-2.5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => onChange(e.target.value)}
            aria-label="Search remote jobs by title, company, or skills"
            placeholder="Search by job title, company, or skill (e.g. React, Python, Design)..."
            className={`block min-h-11 w-full rounded-lg border bg-white py-2.5 pr-10 pl-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              focused
                ? 'border-blue-600'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                onSubmit('');
              }}
              aria-label="Clear search query"
              className="absolute top-1/2 right-2.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" size="lg" loading={loading}>
          Search Jobs
        </Button>
      </form>

      {searchHistory.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Recent searches:</span>
          {searchHistory.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                onChange(term);
                onSubmit(term);
              }}
              className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-blue-600 dark:text-slate-300 dark:decoration-slate-600 dark:hover:text-blue-400 cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
