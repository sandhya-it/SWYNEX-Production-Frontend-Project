import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  ExternalLink,
  MapPin,
  Phone,
  Trash2,
  Video,
} from 'lucide-react';
import { InterviewItem, InterviewMode } from '../../types/career';
import { formatDateTime, getInterviewCountdown } from '../../utils/formatters';
import { getSafeHref } from '../../utils/sanitizeHtml';
import { Button } from '../common/Button';

export interface InterviewCardProps {
  interview: InterviewItem;
  onToggleComplete: (id: string) => void;
  onEdit: (interview: InterviewItem) => void;
  onDelete: (interview: InterviewItem) => void;
}

const modeIcon: Record<InterviewMode, React.ReactNode> = {
  Online: <Video className="h-3.5 w-3.5" aria-hidden="true" />,
  'In-person': <MapPin className="h-3.5 w-3.5" aria-hidden="true" />,
  Phone: <Phone className="h-3.5 w-3.5" aria-hidden="true" />,
};

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const countdown = getInterviewCountdown(interview.dateTime);
  const meetingUrl = interview.locationOrLink.startsWith('http')
    ? getSafeHref(interview.locationOrLink)
    : null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {interview.position}
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
                interview.completed
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : countdown.isSoon
                  ? 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
              }`}
            >
              {interview.completed ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="tabular-nums">{countdown.label}</span>
                </>
              )}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            {interview.companyName} · {interview.round}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(interview)}
            aria-label={`Edit interview with ${interview.companyName}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(interview)}
            aria-label={`Delete interview with ${interview.companyName}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/60 dark:hover:text-red-400 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
          {formatDateTime(interview.dateTime)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          {modeIcon[interview.mode]}
          {interview.mode}
        </span>
        {interview.locationOrLink && (
          meetingUrl ? (
            <a
              href={meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <span>Join Meeting Link</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          ) : (
            <span className="truncate">{interview.locationOrLink}</span>
          )
        )}
      </div>

      {interview.notes && (
        <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
          {interview.notes}
        </p>
      )}

      <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
        <Button
          size="sm"
          variant={interview.completed ? 'outline' : 'secondary'}
          onClick={() => onToggleComplete(interview.id)}
          leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
        >
          {interview.completed ? 'Move to Upcoming' : 'Mark Completed'}
        </Button>
      </div>
    </article>
  );
};
