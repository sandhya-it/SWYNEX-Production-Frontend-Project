import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, ExternalLink, GripVertical, Trash2 } from 'lucide-react';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
} from '../../types/career';
import { formatDate } from '../../utils/formatters';
import { getSafeHref } from '../../utils/sanitizeHtml';

export interface ApplicationCardProps {
  application: JobApplication;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLElement>, id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onStatusChange,
  onEdit,
  onDelete,
  draggable = true,
  onDragStart,
}) => {
  const safeUrl = getSafeHref(application.jobUrl);

  return (
    <article
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, application.id)}
      className="group rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            to={`/applications/${application.id}`}
            className="block truncate font-display text-sm font-semibold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {application.jobTitle}
          </Link>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-600 dark:text-slate-300">
            {application.companyName}
          </p>
        </div>

        {draggable && (
          <GripVertical
            className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400"
            aria-hidden="true"
          />
        )}
      </div>

      <p className="mt-2 truncate text-xs text-slate-500 dark:text-slate-400">
        {application.location} · {application.jobType} ·{' '}
        <span className="tabular-nums">{formatDate(application.appliedDate)}</span>
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
        <select
          aria-label={`Change status for ${application.jobTitle}`}
          value={application.status}
          onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
          className="min-h-8 max-w-[140px] rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {APPLICATION_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open job listing for ${application.jobTitle}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => onEdit(application)}
            aria-label={`Edit ${application.jobTitle}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(application)}
            aria-label={`Delete ${application.jobTitle}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
