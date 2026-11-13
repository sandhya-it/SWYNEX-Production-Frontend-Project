import React, { useState } from 'react';
import { Check, ExternalLink, Plus } from 'lucide-react';
import { useApplications } from '../../hooks/useApplications';
import { RemotiveJob } from '../../types/career';
import { formatDate, formatJobTypeLabel } from '../../utils/formatters';
import { getSafeHref, stripHtmlToPreview } from '../../utils/sanitizeHtml';
import { Button } from '../common/Button';
import { SaveJobButton } from './SaveJobButton';

export interface JobCardProps {
  job: RemotiveJob;
  onSelect: (job: RemotiveJob) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const { addApplicationFromJob, isJobApplied } = useApplications();
  const [logoFailed, setLogoFailed] = useState(false);

  const alreadyApplied = isJobApplied(job);
  const safeExternalUrl = getSafeHref(job.url);
  const preview = stripHtmlToPreview(job.description, 155);
  const initials = job.company_name.slice(0, 2).toUpperCase();

  return (
    <article className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3.5">
            {job.company_logo && !logoFailed ? (
              <img
                src={job.company_logo}
                alt={`${job.company_name} logo`}
                referrerPolicy="no-referrer"
                onError={() => setLogoFailed(true)}
                className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1 dark:border-slate-700"
              />
            ) : (
              <div
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0b162c] font-display text-xs font-bold text-white dark:bg-blue-950 dark:text-blue-200"
              >
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold leading-snug text-slate-900 dark:text-white">
                <button
                  type="button"
                  onClick={() => onSelect(job)}
                  className="text-left hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:text-blue-400 cursor-pointer"
                >
                  {job.title}
                </button>
              </h3>
              <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                {job.company_name}
              </p>
            </div>
          </div>

          <SaveJobButton job={job} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>{job.category}</span>
          <span aria-hidden="true">·</span>
          <span>{formatJobTypeLabel(job.job_type)}</span>
          <span aria-hidden="true">·</span>
          <span>{job.candidate_required_location || 'Remote'}</span>
          {job.publication_date && (
            <>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{formatDate(job.publication_date)}</span>
            </>
          )}
        </div>

        {job.salary && (
          <p className="mt-2 font-mono text-xs font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
            Compensation: {job.salary}
          </p>
        )}

        {preview && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {preview}
          </p>
        )}

        {job.tags.length > 0 && (
          <p className="mt-2.5 truncate text-xs text-slate-500 dark:text-slate-400">
            Skills: {job.tags.slice(0, 5).join(' · ')}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-100 pt-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => onSelect(job)}
            className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
          >
            View Details
          </button>
          {safeExternalUrl && (
            <a
              href={safeExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <span>Remotive</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
        </div>

        <Button
          size="sm"
          variant={alreadyApplied ? 'outline' : 'primary'}
          disabled={alreadyApplied}
          onClick={() => addApplicationFromJob(job)}
          leftIcon={
            alreadyApplied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )
          }
        >
          {alreadyApplied ? 'Tracked' : 'Add to Applications'}
        </Button>
      </div>
    </article>
  );
};
