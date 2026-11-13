import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarPlus,
  Edit2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { StatusBadge } from '../components/applications/StatusBadge';
import { Button } from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/dashboard/EmptyState';
import { InterviewCard } from '../components/interviews/InterviewCard';
import { InterviewForm } from '../components/interviews/InterviewForm';
import { PageHeader } from '../components/layout/PageHeader';
import { useApplications } from '../hooks/useApplications';
import { useInterviews } from '../hooks/useInterviews';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  InterviewItem,
} from '../types/career';
import { formatDate } from '../utils/formatters';
import { getSafeHref } from '../utils/sanitizeHtml';

export const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    applications,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  } = useApplications();
  const {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  } = useInterviews();

  const [editOpen, setEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [interviewFormOpen, setInterviewFormOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<InterviewItem | null>(null);
  const [deletingInterview, setDeletingInterview] = useState<InterviewItem | null>(null);

  const application = useMemo(
    () => applications.find((a) => a.id === id),
    [applications, id]
  );

  const linkedInterviews = useMemo(() => {
    if (!application) return [];
    return interviews.filter(
      (iv) =>
        iv.applicationId === application.id ||
        (iv.companyName.toLowerCase() === application.companyName.toLowerCase() &&
          iv.position.toLowerCase() === application.jobTitle.toLowerCase())
    );
  }, [application, interviews]);

  if (!application) {
    return (
      <div className="space-y-6">
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Applications</span>
        </Link>
        <EmptyState
          title="Application not found"
          description="This application may have been deleted or the URL identifier is invalid."
          action={
            <Link to="/applications">
              <Button>Return to My Applications</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const safeUrl = getSafeHref(application.jobUrl);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to My Applications</span>
        </Link>
      </div>

      <PageHeader
        title={application.jobTitle}
        subtitle={`${application.companyName} · ${application.location} · ${application.jobType}`}
        actions={
          <>
            {safeUrl && (
              <a
                href={safeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                <span>Open Listing</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <Button
              variant="outline"
              onClick={() => setEditOpen(true)}
              leftIcon={<Edit2 className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmDeleteOpen(true)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Application Metadata & Notes */}
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Current Stage
              </p>
              <div className="mt-1.5">
                <StatusBadge status={application.status} />
              </div>
            </div>

            <div>
              <label
                htmlFor="detail-status-select"
                className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400"
              >
                Update Status
              </label>
              <select
                id="detail-status-select"
                value={application.status}
                onChange={(e) =>
                  updateApplicationStatus(application.id, e.target.value as ApplicationStatus)
                }
                className="min-h-9 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {APPLICATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Application Date</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums dark:text-white">
                {formatDate(application.appliedDate)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Follow-Up Date</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums dark:text-white">
                {application.followUpDate ? formatDate(application.followUpDate) : 'Not scheduled'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Employment Type</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                {application.jobType}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500 dark:text-slate-400">Category</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                {application.category || 'General'}
              </dd>
            </div>
            {application.salary && (
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">Compensation</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-emerald-700 tabular-nums dark:text-emerald-400">
                  {application.salary}
                </dd>
              </div>
            )}
          </dl>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Personal Notes
            </h2>
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
              {application.notes || 'No personal notes added yet. Click Edit to add contact info, resume version, or preparation notes.'}
            </div>
          </div>
        </section>

        {/* Linked Interviews */}
        <section className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Interviews for This Role
            </h2>
            <Button
              size="sm"
              onClick={() => {
                setEditingInterview(null);
                setInterviewFormOpen(true);
              }}
              leftIcon={<CalendarPlus className="h-4 w-4" />}
            >
              Schedule Round
            </Button>
          </div>

          {linkedInterviews.length === 0 ? (
            <EmptyState
              title="No interviews scheduled yet"
              description="Schedule phone screens, technical rounds, or final interviews directly linked to this application."
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingInterview(null);
                    setInterviewFormOpen(true);
                  }}
                >
                  Schedule Interview
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {linkedInterviews.map((iv) => (
                <InterviewCard
                  key={iv.id}
                  interview={iv}
                  onToggleComplete={toggleInterviewCompleted}
                  onEdit={(item) => {
                    setEditingInterview(item);
                    setInterviewFormOpen(true);
                  }}
                  onDelete={(item) => setDeletingInterview(item)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <ApplicationForm
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={application}
        onSubmit={(payload) => {
          updateApplication(application.id, payload);
          return true;
        }}
      />

      <InterviewForm
        isOpen={interviewFormOpen}
        onClose={() => {
          setInterviewFormOpen(false);
          setEditingInterview(null);
        }}
        initialData={editingInterview}
        presetApplicationId={application.id}
        onSubmit={(payload) => {
          if (editingInterview) {
            updateInterview(editingInterview.id, payload);
          } else {
            addInterview(payload);
          }
        }}
      />

      <ConfirmationDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={() => {
          deleteApplication(application.id);
          navigate('/applications');
        }}
        title="Delete Application"
        message={`Delete your application for ${application.jobTitle} at ${application.companyName}? This action cannot be undone.`}
        confirmLabel="Delete Application"
      />

      <ConfirmationDialog
        isOpen={Boolean(deletingInterview)}
        onClose={() => setDeletingInterview(null)}
        onConfirm={() => {
          if (deletingInterview) deleteInterview(deletingInterview.id);
        }}
        title="Delete Interview"
        message={
          deletingInterview
            ? `Remove the ${deletingInterview.round} interview with ${deletingInterview.companyName}?`
            : ''
        }
        confirmLabel="Delete Interview"
      />
    </div>
  );
};
