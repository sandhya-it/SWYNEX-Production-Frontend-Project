import React, { useEffect, useState } from 'react';
import { useApplications } from '../../hooks/useApplications';
import { InterviewItem, InterviewMode } from '../../types/career';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';

export interface InterviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: InterviewItem | null;
  presetApplicationId?: string;
  onSubmit: (data: Omit<InterviewItem, 'id' | 'createdAt'>) => void;
}

interface FormState {
  applicationId: string;
  companyName: string;
  position: string;
  round: string;
  mode: InterviewMode;
  dateTime: string;
  locationOrLink: string;
  notes: string;
  completed: boolean;
}

function getDefaultDateTime(): string {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  tomorrow.setMinutes(0, 0, 0);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const hours = String(tomorrow.getHours()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:00`;
}

export const InterviewForm: React.FC<InterviewFormProps> = ({
  isOpen,
  onClose,
  initialData,
  presetApplicationId,
  onSubmit,
}) => {
  const { applications } = useApplications();

  const [form, setForm] = useState<FormState>({
    applicationId: '',
    companyName: '',
    position: '',
    round: 'Technical Round',
    mode: 'Online',
    dateTime: getDefaultDateTime(),
    locationOrLink: '',
    notes: '',
    completed: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        applicationId: initialData.applicationId || '',
        companyName: initialData.companyName,
        position: initialData.position,
        round: initialData.round,
        mode: initialData.mode,
        dateTime: initialData.dateTime,
        locationOrLink: initialData.locationOrLink,
        notes: initialData.notes,
        completed: initialData.completed,
      });
    } else {
      const linked = presetApplicationId
        ? applications.find((a) => a.id === presetApplicationId)
        : undefined;
      setForm({
        applicationId: linked?.id || '',
        companyName: linked?.companyName || '',
        position: linked?.jobTitle || '',
        round: 'Technical Round',
        mode: 'Online',
        dateTime: getDefaultDateTime(),
        locationOrLink: '',
        notes: '',
        completed: false,
      });
    }
    setErrors({});
  }, [isOpen, initialData, presetApplicationId, applications]);

  const handleApplicationLinkChange = (appId: string) => {
    const matched = applications.find((a) => a.id === appId);
    setForm((prev) => ({
      ...prev,
      applicationId: appId,
      companyName: matched ? matched.companyName : prev.companyName,
      position: matched ? matched.jobTitle : prev.position,
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.companyName.trim()) nextErrors.companyName = 'Company name is required.';
    if (!form.position.trim()) nextErrors.position = 'Job position is required.';
    if (!form.round.trim()) nextErrors.round = 'Interview round is required.';
    if (!form.dateTime) nextErrors.dateTime = 'Date and time are required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      applicationId: form.applicationId || undefined,
      companyName: form.companyName.trim(),
      position: form.position.trim(),
      round: form.round.trim(),
      mode: form.mode,
      dateTime: form.dateTime,
      locationOrLink: form.locationOrLink.trim(),
      notes: form.notes.trim(),
      completed: form.completed,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Interview' : 'Schedule Interview'}
      subtitle="Keep dates, meeting links, and preparation notes organized in one place."
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="interview-form">
            {initialData ? 'Save Changes' : 'Schedule Interview'}
          </Button>
        </>
      }
    >
      <form id="interview-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        {applications.length > 0 && (
          <Select
            label="Link to Existing Application (Optional)"
            value={form.applicationId}
            onChange={(e) => handleApplicationLinkChange(e.target.value)}
            options={[
              { label: '— Not linked —', value: '' },
              ...applications.map((a) => ({
                label: `${a.jobTitle} at ${a.companyName}`,
                value: a.id,
              })),
            ]}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Company Name"
            required
            placeholder="e.g. Stripe"
            value={form.companyName}
            error={errors.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
          <Input
            label="Job Position"
            required
            placeholder="e.g. Frontend Developer"
            value={form.position}
            error={errors.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Interview Round"
            required
            placeholder="e.g. HR Screen, Technical"
            value={form.round}
            error={errors.round}
            onChange={(e) => setForm({ ...form, round: e.target.value })}
          />
          <Select
            label="Interview Mode"
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value as InterviewMode })}
            options={[
              { label: 'Online', value: 'Online' },
              { label: 'In-person', value: 'In-person' },
              { label: 'Phone', value: 'Phone' },
            ]}
          />
          <Input
            label="Date & Time"
            type="datetime-local"
            required
            value={form.dateTime}
            error={errors.dateTime}
            onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
          />
        </div>

        <Input
          label="Location or Meeting Link"
          placeholder="https://meet.google.com/... or Office address / Phone number"
          value={form.locationOrLink}
          onChange={(e) => setForm({ ...form, locationOrLink: e.target.value })}
        />

        <div>
          <label
            htmlFor="interview-notes"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Preparation Notes
          </label>
          <textarea
            id="interview-notes"
            rows={4}
            placeholder="Key topics to review, questions to ask the interviewer, portfolio links..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {initialData && (
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer dark:text-slate-200">
            <input
              type="checkbox"
              checked={form.completed}
              onChange={(e) => setForm({ ...form, completed: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>Mark interview as completed</span>
          </label>
        )}
      </form>
    </Modal>
  );
};
