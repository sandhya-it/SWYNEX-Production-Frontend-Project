import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, ExternalLink, Eye, Trash2 } from 'lucide-react';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
} from '../../types/career';
import { formatDate } from '../../utils/formatters';
import { getSafeHref } from '../../utils/sanitizeHtml';
import { StatusBadge } from './StatusBadge';

export interface ApplicationTableProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300">
              <th className="px-4 py-3">Role &amp; Company</th>
              <th className="px-4 py-3">Location &amp; Type</th>
              <th className="px-4 py-3">Applied Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Follow-Up</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {applications.map((app) => {
              const safeUrl = getSafeHref(app.jobUrl);
              return (
                <tr
                  key={app.id}
                  className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/applications/${app.id}`}
                      className="font-medium text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                    >
                      {app.jobTitle}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{app.companyName}</p>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-300">
                    <span>{app.location}</span>
                    <span className="mx-1.5 text-slate-300 dark:text-slate-600" aria-hidden="true">
                      ·
                    </span>
                    <span>{app.jobType}</span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600 tabular-nums dark:text-slate-300">
                    {formatDate(app.appliedDate)}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} />
                      <select
                        aria-label={`Update status for ${app.jobTitle}`}
                        value={app.status}
                        onChange={(e) =>
                          onStatusChange(app.id, e.target.value as ApplicationStatus)
                        }
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {APPLICATION_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {app.followUpDate ? formatDate(app.followUpDate) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Link
                        to={`/applications/${app.id}`}
                        aria-label={`View details for ${app.jobTitle}`}
                        title="View details"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      {safeUrl && (
                        <a
                          href={safeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open job listing for ${app.jobTitle}`}
                          title="Open listing"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onEdit(app)}
                        aria-label={`Edit ${app.jobTitle}`}
                        title="Edit"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(app)}
                        aria-label={`Delete ${app.jobTitle}`}
                        title="Delete"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
