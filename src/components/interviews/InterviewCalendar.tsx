import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InterviewItem } from '../../types/career';
import { formatDateTime } from '../../utils/formatters';

export interface InterviewCalendarProps {
  interviews: InterviewItem[];
  onSelectInterview?: (interview: InterviewItem) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const InterviewCalendar: React.FC<InterviewCalendarProps> = ({
  interviews,
  onSelectInterview,
}) => {
  const [cursorDate, setCursorDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const year = cursorDate.getFullYear();
  const month = cursorDate.getMonth();

  const interviewsByDay = useMemo(() => {
    const map = new Map<string, InterviewItem[]>();
    interviews.forEach((iv) => {
      if (!iv.dateTime) return;
      const d = new Date(iv.dateTime);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
      const existing = map.get(key) || [];
      existing.push(iv);
      map.set(key, existing);
    });
    return map;
  }, [interviews]);

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; key: string | null }> = [];

    for (let i = 0; i < firstWeekday; i++) {
      cells.push({ day: null, key: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, key });
    }
    return cells;
  }, [year, month]);

  const monthLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(cursorDate);

  const selectedList = selectedDayKey ? interviewsByDay.get(selectedDayKey) || [] : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
          {monthLabel}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCursorDate(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setCursorDate(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
            className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCursorDate(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell, idx) => {
          if (!cell.day || !cell.key) {
            return <div key={`empty-${idx}`} className="min-h-16 rounded-lg bg-slate-50/40 dark:bg-slate-950/30" />;
          }
          const dayItems = interviewsByDay.get(cell.key) || [];
          const isSelected = selectedDayKey === cell.key;

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => setSelectedDayKey(cell.key)}
              className={`flex min-h-16 flex-col items-start justify-between rounded-lg border p-1.5 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/60 dark:border-blue-500 dark:bg-blue-950/40'
                  : 'border-slate-100 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
              }`}
            >
              <span className="font-mono text-xs font-medium text-slate-700 tabular-nums dark:text-slate-300">
                {cell.day}
              </span>
              {dayItems.length > 0 && (
                <div className="w-full space-y-0.5">
                  {dayItems.slice(0, 2).map((iv) => (
                    <span
                      key={iv.id}
                      className={`block truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                        iv.completed
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {iv.companyName}
                    </span>
                  ))}
                  {dayItems.length > 2 && (
                    <span className="block text-[10px] text-slate-500 tabular-nums dark:text-slate-400">
                      +{dayItems.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDayKey && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <h4 className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
            Interviews on {selectedDayKey}
          </h4>
          {selectedList.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              No interviews scheduled on this date.
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              {selectedList.map((iv) => (
                <button
                  key={iv.id}
                  type="button"
                  onClick={() => onSelectInterview?.(iv)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-white">
                      {iv.position} — {iv.companyName}
                    </p>
                    <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      {formatDateTime(iv.dateTime)} · {iv.round} · {iv.mode}
                    </p>
                  </div>
                  <span className="ml-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                    Edit
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
