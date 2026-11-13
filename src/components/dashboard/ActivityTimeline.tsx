import React from 'react';
import {
  Bookmark,
  Briefcase,
  CalendarCheck2,
  CalendarClock,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { ActivityEntry } from '../../types/career';
import { formatRelativeTime } from '../../utils/formatters';
import { EmptyState } from './EmptyState';

export interface ActivityTimelineProps {
  activities: ActivityEntry[];
  limit?: number;
}

const iconForActivity: Record<ActivityEntry['type'], React.ReactNode> = {
  application_added: <Briefcase className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />,
  status_changed: <RefreshCw className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />,
  interview_scheduled: <CalendarClock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />,
  interview_completed: <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />,
  job_saved: <Bookmark className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />,
  profile_updated: <UserCheck className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />,
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  limit = 6,
}) => {
  const visible = activities.slice(0, limit);

  if (visible.length === 0) {
    return (
      <EmptyState
        title="No activity recorded yet"
        description="Actions such as saving jobs, adding applications, or scheduling interviews will appear here."
      />
    );
  }

  return (
    <ul className="divide-y divide-slate-200 dark:divide-slate-800">
      {visible.map((item) => (
        <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            {iconForActivity[item.type]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
              {item.title}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.detail}</p>
          </div>
          <span className="shrink-0 font-mono text-xs text-slate-400 tabular-nums dark:text-slate-500">
            {formatRelativeTime(item.timestamp)}
          </span>
        </li>
      ))}
    </ul>
  );
};
