import React, { useState } from 'react';
import { Check, ExternalLink, Plus } from 'lucide-react';
import { useApplications } from '../../hooks/useApplications';
import { RemotiveJob } from '../../types/career';
import { formatDate, formatJobTypeLabel } from '../../utils/formatters';
import { getSafeHref, renderSafeHtml } from '../../utils/sanitizeHtml';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { SaveJobButton } from './SaveJobButton';

export interface JobDetailsProps {
  job: RemotiveJob | null;
  onClose: () => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job, onClose }) => {
  const { addApplicationFromJob, isJobApplied } = useApplications();
  const [logoFailed, setLogoFailed] = useState(false);

  if (!job) return null;

  const alreadyApplied = isJobApplied(job);
  const safeExternalUrl = getSafeHref(job.url);
  const initials = job.company_name.slice(0, 2).toUpperCase();

  return (
    <Modal
      isOpen={Boolean(job)}
      onClose={onClose}
      title={job.title}
      subtitle={`${job.company_name} · ${job.candidate_required_location || 'Remote'}`}
      size="xl"
      footer={
        <div className="flex w-full flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Source: Remotive Public Jobs Feed (listings may be delayed up to 24 hours)
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <SaveJobButton job={job} variant="button" />
            <Button
              variant={alreadyApplied ? 'outline' : 'secondary'}
              disabled={alreadyApplied}
              onClick={() => addApplicationFromJob(job)}
              leftIcon={alreadyApplied ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            >
              {alreadyApplied ? 'In My Applications' : 'Add to Applications'}
            </Button>
            {safeExternalUrl && (
              <a
                href={safeExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
              >
                <span>View Original Listing</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          {job.company_logo && !logoFailed ? (
            <img
              src={job.company_logo}
              alt={`${job.company_name} logo`}
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="h-14 w-14 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1.5 dark:border-slate-700"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0b162c] font-display text-base font-bold text-white"
            >
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {job.company_name}
            </p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span>{job.category}</span>
              <span aria-hidden="true">·</span>
              <span>{formatJobTypeLabel(job.job_type)}</span>
              <span aria-hidden="true">·</span>
              <span>{job.candidate_required_location || 'Remote'}</span>
              {job.publication_date && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Published {formatDate(job.publication_date)}</span>
                </>
              )}
            </div>
            {job.salary && (
              <p className="font-mono text-xs font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
                Compensation: {job.salary}
              </p>
            )}
          </div>
        </div>

        {job.tags.length > 0 && (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Relevant Skills & Topics
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {job.tags.join(' · ')}
            </p>
          </div>
        )}

        <div>
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
            Role Description
          </h3>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950/60">
            {renderSafeHtml(job.description)}
          </div>
        </div>
      </div>
    </Modal>
  );
};
