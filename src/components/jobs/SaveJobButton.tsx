import React from 'react';
import { Bookmark } from 'lucide-react';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { RemotiveJob } from '../../types/career';

export interface SaveJobButtonProps {
  job: RemotiveJob;
  variant?: 'icon' | 'button';
}

export const SaveJobButton: React.FC<SaveJobButtonProps> = ({ job, variant = 'icon' }) => {
  const { isJobSaved, toggleSaveJob } = useSavedJobs();
  const saved = isJobSaved(job.id);

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={() => toggleSaveJob(job)}
        aria-pressed={saved}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          saved
            ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
        <span>{saved ? 'Saved' : 'Save Job'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggleSaveJob(job)}
      aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title}`}
      aria-pressed={saved}
      title={saved ? 'Remove bookmark' : 'Save job'}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
        saved
          ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
      }`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} aria-hidden="true" />
    </button>
  );
};
