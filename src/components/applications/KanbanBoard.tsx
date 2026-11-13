import React, { useState } from 'react';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
} from '../../types/career';
import { ApplicationCard } from './ApplicationCard';
import { StatusBadge } from './StatusBadge';

export interface KanbanBoardProps {
  applications: JobApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<ApplicationStatus | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLElement>, id: string) => {
    setDraggedId(id);
    event.dataTransfer.setData('text/plain', id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, status: ApplicationStatus) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (dragOverStatus !== status) {
      setDragOverStatus(status);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: ApplicationStatus) => {
    event.preventDefault();
    const droppedId = event.dataTransfer.getData('text/plain') || draggedId;
    if (droppedId) {
      onStatusChange(droppedId, status);
    }
    setDraggedId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="overflow-x-auto pb-3">
      <div className="grid min-w-[1140px] grid-cols-6 gap-3.5">
        {APPLICATION_STATUSES.map((status) => {
          const items = applications.filter((a) => a.status === status);
          const isTarget = dragOverStatus === status;

          return (
            <div
              key={status}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={() => setDragOverStatus((prev) => (prev === status ? null : prev))}
              onDrop={(e) => handleDrop(e, status)}
              className={`flex min-h-[420px] flex-col rounded-xl border p-3 transition-colors ${
                isTarget
                  ? 'border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/30'
                  : 'border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div className="mb-3 flex items-center justify-between gap-2 px-1">
                <StatusBadge status={status} />
                <span className="font-mono text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
                  {items.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2.5">
                {items.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300/80 p-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
                    Drop card here
                  </div>
                ) : (
                  items.map((app) => (
                    <ApplicationCard
                      key={app.id}
                      application={app}
                      onStatusChange={onStatusChange}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
