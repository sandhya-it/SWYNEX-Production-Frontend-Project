import React from 'react';

interface SkeletonProps {
  variant?: 'card' | 'table' | 'stats';
  count?: number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({ variant = 'card', count = 6 }) => {
  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading statistics">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-8 w-16 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-3 w-36 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div
        className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        aria-busy="true"
        aria-label="Loading table rows"
      >
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="flex animate-pulse items-center justify-between gap-4 px-5 py-4">
              <div className="space-y-2">
                <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800/60" />
              </div>
              <div className="h-6 w-24 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading job opportunities"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 shrink-0 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-3.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 dark:border-slate-800">
            <div className="h-3 w-28 rounded bg-slate-100 dark:bg-slate-800/60" />
            <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
};
