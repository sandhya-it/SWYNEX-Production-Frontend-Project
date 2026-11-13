import React, { useEffect, useState } from 'react';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
} from '../../types/career';
import { getTodayDateInput, isValidUrl } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { Select } from '../common/Select';

export interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: JobApplication | null;
  onSubmit: (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => boolean | void;
}

interface FormState {
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  category: string;
  appliedDate: string;
  status: ApplicationStatus;
  jobUrl: string;
  followUpDate: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  jobTitle: '',
  companyName: '',
  location: 'Remote',
  jobType: 'Full Time',
  category: 'Software Development',
  appliedDate: getTodayDateInput(),
  status: 'Applied',
  jobUrl: '',
  followUpDate: '',
  notes: '',
};

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        jobTitle: initialData.jobTitle,
        companyName: initialData.companyName,
        location: initialData.location,
        jobType: initialData.jobType,
        category: initialData.category || 'Software Development',
        appliedDate: initialData.appliedDate,
        status: initialData.status,
        jobUrl: initialData.jobUrl || '',
        followUpDate: initialData.followUpDate || '',
        notes: initialData.notes || '',
      });
    } else {
      setForm({ ...EMPTY_FORM, appliedDate: getTodayDateInput() });
    }
    setErrors({});
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.jobTitle.trim()) {
      nextErrors.jobTitle = 'Job title is required.';
    }
    if (!form.companyName.trim()) {
      nextErrors.companyName = 'Company name is required.';
    }
    if (!form.appliedDate) {
      nextErrors.appliedDate = 'Application date is required.';
    }
    if (form.jobUrl.trim() && !isValidUrl(form.jobUrl)) {
      nextErrors.jobUrl = 'Please enter a valid URL starting with http:// or https://.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const result = onSubmit({
      jobId: initialData?.jobId,
      jobTitle: form.jobTitle.trim(),
      companyName: form.companyName.trim(),
      location: form.location.trim() || 'Remote',
      jobType: form.jobType,
      category: form.category.trim() || undefined,
      appliedDate: form.appliedDate,
      status: form.status,
      jobUrl: form.jobUrl.trim(),
      followUpDate: form.followUpDate,
      notes: form.notes.trim(),
      salary: initialData?.salary,
    });

    if (result !== false) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Application' : 'Add Job Application'}
      subtitle={
        initialData
          ? `Update tracking details for ${initialData.companyName}`
          : 'Log a new job or internship application in your personal tracker.'
      }
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="application-form">
            {initialData ? 'Save Changes' : 'Add Application'}
          </Button>
        </>
      }
    >
      <form id="application-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Job Title"
            required
            placeholder="e.g. Frontend Engineer Intern"
            value={form.jobTitle}
            error={errors.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          />
          <Input
            label="Company Name"
            required
            placeholder="e.g. Acme Labs"
            value={form.companyName}
            error={errors.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Job Location"
            placeholder="e.g. Remote, New York, Berlin"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <Select
            label="Job Type"
            value={form.jobType}
            onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            options={[
              { label: 'Full Time', value: 'Full Time' },
              { label: 'Internship', value: 'Internship' },
              { label: 'Contract', value: 'Contract' },
              { label: 'Part Time', value: 'Part Time' },
              { label: 'Freelance', value: 'Freelance' },
            ]}
          />
          <Input
            label="Category"
            placeholder="e.g. Software Development"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Application Date"
            type="date"
            required
            value={form.appliedDate}
            error={errors.appliedDate}
            onChange={(e) => setForm({ ...form, appliedDate: e.target.value })}
          />
          <Select
            label="Application Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as ApplicationStatus })
            }
            options={APPLICATION_STATUSES.map((s) => ({ label: s, value: s }))}
          />
          <Input
            label="Follow-Up Date"
            type="date"
            value={form.followUpDate}
            onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
          />
        </div>

        <Input
          label="Job Listing URL"
          type="url"
          placeholder="https://..."
          value={form.jobUrl}
          error={errors.jobUrl}
          onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
        />

        <div>
          <label
            htmlFor="application-notes"
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Personal Notes
          </label>
          <textarea
            id="application-notes"
            rows={4}
            placeholder="Recruiter contact, tailored resume version, salary expectations, or referral details..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </form>
    </Modal>
  );
};
