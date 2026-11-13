import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, Columns3, Plus, Search, Table2 } from 'lucide-react';
import { ApplicationForm } from '../components/applications/ApplicationForm';
import { ApplicationTable } from '../components/applications/ApplicationTable';
import { KanbanBoard } from '../components/applications/KanbanBoard';
import { Button } from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { EmptyState } from '../components/dashboard/EmptyState';
import { PageHeader } from '../components/layout/PageHeader';
import { useApplications } from '../hooks/useApplications';
import { APPLICATION_STATUSES, JobApplication } from '../types/career';

export const MyApplicationsPage: React.FC = () => {
  const {
    applications,
    addApplication,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
  } = useApplications();

  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [formOpen, setFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditingApp(null);
      setFormOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matched = applications.filter((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (q) {
        const hay = `${app.jobTitle} ${app.companyName} ${app.location} ${app.notes}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...matched].sort((a, b) => {
      const timeA = new Date(a.appliedDate).getTime();
      const timeB = new Date(b.appliedDate).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });
  }, [applications, search, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track every role from submission through final offer across table and Kanban views."
        actions={
          <>
            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                aria-pressed={viewMode === 'table'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Table2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                aria-pressed={viewMode === 'kanban'}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-slate-900 text-white dark:bg-blue-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Columns3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Kanban Board</span>
              </button>
            </div>

            <Button
              onClick={() => {
                setEditingApp(null);
                setFormOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Application
            </Button>
          </>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="sm:col-span-6">
          <Input
            label="Search Applications"
            placeholder="Search role, company, location, or notes..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            label="Status Filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'All' },
              ...APPLICATION_STATUSES.map((s) => ({ label: s, value: s })),
            ]}
          />
        </div>
        <div className="sm:col-span-3">
          <Select
            label="Sort by Date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
            options={[
              { label: 'Newest Applied First', value: 'newest' },
              { label: 'Oldest Applied First', value: 'oldest' },
            ]}
          />
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="No job applications tracked yet"
          description="Log a role manually or add opportunities directly from the Find Jobs explorer to manage your pipeline."
          action={
            <Button
              onClick={() => {
                setEditingApp(null);
                setFormOpen(true);
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add First Application
            </Button>
          }
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState
          title="No matching applications found"
          description="Try clearing your search input or changing the selected status filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
            >
              Clear Filters
            </Button>
          }
        />
      ) : viewMode === 'table' ? (
        <ApplicationTable
          applications={filteredApplications}
          onStatusChange={updateApplicationStatus}
          onEdit={(app) => {
            setEditingApp(app);
            setFormOpen(true);
          }}
          onDelete={(app) => setDeletingApp(app)}
        />
      ) : (
        <KanbanBoard
          applications={filteredApplications}
          onStatusChange={updateApplicationStatus}
          onEdit={(app) => {
            setEditingApp(app);
            setFormOpen(true);
          }}
          onDelete={(app) => setDeletingApp(app)}
        />
      )}

      <ApplicationForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingApp(null);
        }}
        initialData={editingApp}
        onSubmit={(payload) => {
          if (editingApp) {
            updateApplication(editingApp.id, payload);
            return true;
          }
          const result = addApplication(payload);
          return result.added;
        }}
      />

      <ConfirmationDialog
        isOpen={Boolean(deletingApp)}
        onClose={() => setDeletingApp(null)}
        onConfirm={() => {
          if (deletingApp) {
            deleteApplication(deletingApp.id);
          }
        }}
        title="Delete Application"
        message={
          deletingApp
            ? `Are you sure you want to delete your application for ${deletingApp.jobTitle} at ${deletingApp.companyName}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Application"
      />
    </div>
  );
};
