import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, CalendarPlus, ListFilter } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/dashboard/EmptyState';
import { InterviewCalendar } from '../components/interviews/InterviewCalendar';
import { InterviewCard } from '../components/interviews/InterviewCard';
import { InterviewForm } from '../components/interviews/InterviewForm';
import { PageHeader } from '../components/layout/PageHeader';
import { useInterviews } from '../hooks/useInterviews';
import { InterviewItem } from '../types/career';

export const InterviewTrackerPage: React.FC = () => {
  const {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  } = useInterviews();

  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusTab, setStatusTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InterviewItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<InterviewItem | null>(null);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingItem(null);
      setFormOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const upcomingList = useMemo(
    () =>
      interviews
        .filter((iv) => !iv.completed)
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
    [interviews]
  );

  const completedList = useMemo(
    () =>
      interviews
        .filter((iv) => iv.completed)
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()),
    [interviews]
  );

  const visibleList =
    statusTab === 'upcoming'
      ? upcomingList
      : statusTab === 'completed'
      ? completedList
      : interviews;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Tracker"
        subtitle="Manage upcoming interview rounds, countdown reminders, meeting links, and preparation notes."
        actions={
          <>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                aria-pressed={viewMode === 'calendar'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Calendar</span>
              </button>
            </div>

            <Button
              onClick={() => {
                setEditingItem(null);
                setFormOpen(true);
              }}
              leftIcon={<CalendarPlus className="h-4 w-4" />}
            >
              Schedule Interview
            </Button>
          </>
        }
      />

      {viewMode === 'list' ? (
        <div className="space-y-5">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setStatusTab('upcoming')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Upcoming ({upcomingList.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('completed')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusTab === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Completed ({completedList.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('all')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              All ({interviews.length})
            </button>
          </div>

          {visibleList.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-5 w-5" />}
              title={
                statusTab === 'completed'
                  ? 'No completed interviews yet'
                  : 'No interviews scheduled yet'
              }
              description="Schedule an interview round to track countdowns, meeting links, and preparation checklists."
              action={
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setFormOpen(true);
                  }}
                  leftIcon={<CalendarPlus className="h-4 w-4" />}
                >
                  Schedule Interview
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {visibleList.map((iv) => (
                <InterviewCard
                  key={iv.id}
                  interview={iv}
                  onToggleComplete={toggleInterviewCompleted}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setFormOpen(true);
                  }}
                  onDelete={(item) => setDeletingItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <InterviewCalendar
          interviews={interviews}
          onSelectInterview={(iv) => {
            setEditingItem(iv);
            setFormOpen(true);
          }}
        />
      )}

      <InterviewForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={(payload) => {
          if (editingItem) {
            updateInterview(editingItem.id, payload);
          } else {
            addInterview(payload);
          }
        }}
      />

      <ConfirmationDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) deleteInterview(deletingItem.id);
        }}
        title="Delete Interview"
        message={
          deletingItem
            ? `Are you sure you want to delete the ${deletingItem.round} interview with ${deletingItem.companyName}?`
            : ''
        }
        confirmLabel="Delete Interview"
      />
    </div>
  );
};
