import React from 'react';
import {
  Award,
  CalendarClock,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
} from 'lucide-react';
import { ApplicationStatus } from '../../types/career';

const statusConfig: Record<
  ApplicationStatus,
  { style: string; icon: React.ReactNode }
> = {
  Applied: {
    style:
      'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
    icon: <Send className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  'Under Review': {
    style:
      'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/80 dark:bg-blue-950/70 dark:text-blue-300',
    icon: <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  Shortlisted: {
    style:
      'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800/80 dark:bg-indigo-950/70 dark:text-indigo-300',
    icon: <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  'Interview Scheduled': {
    style:
      'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/70 dark:text-amber-300',
    icon: <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  'Offer Received': {
    style:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/70 dark:text-emerald-300',
    icon: <Award className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
  Rejected: {
    style:
      'border-red-200 bg-red-50 text-red-800 dark:border-red-800/80 dark:bg-red-950/70 dark:text-red-300',
    icon: <XCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  },
};

export interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Applied;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${cfg.style}`}
    >
      {cfg.icon}
      <span>{status}</span>
    </span>
  );
};
