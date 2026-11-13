import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme, ThemeMode } from '../hooks/useTheme';
import {
  ActivityEntry,
  ApplicationStatus,
  CareerExportPayload,
  InterviewItem,
  JobApplication,
  RemotiveJob,
  ToastKind,
  ToastMessage,
  UserProfile,
} from '../types/career';
import { formatJobTypeLabel, generateId, getTodayDateInput } from '../utils/formatters';

const APPLICATIONS_KEY = 'careertrack_applications_v1';
const SAVED_JOBS_KEY = 'careertrack_saved_jobs_v1';
const INTERVIEWS_KEY = 'careertrack_interviews_v1';
const PROFILE_KEY = 'careertrack_profile_v1';
const ACTIVITIES_KEY = 'careertrack_activities_v1';

const DEFAULT_PROFILE: UserProfile = {
  fullName: '',
  email: '',
  headline: '',
  careerInterests: [],
  skills: [],
  preferredLocations: [],
  preferredEmploymentType: 'Any',
};

interface CareerContextValue {
  // Storage notice
  storageAvailable: boolean;
  storageError: string | null;

  // Theme
  theme: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (next: ThemeMode) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastKind, title: string, message?: string) => void;
  dismissToast: (id: string) => void;

  // Applications
  applications: JobApplication[];
  addApplication: (
    data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
  ) => { added: boolean; application?: JobApplication; reason?: string };
  addApplicationFromJob: (job: RemotiveJob) => { added: boolean; reason?: string };
  updateApplication: (id: string, patch: Partial<JobApplication>) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  isJobApplied: (job: Pick<RemotiveJob, 'id' | 'url' | 'title' | 'company_name'>) => boolean;

  // Saved Jobs
  savedJobs: RemotiveJob[];
  isJobSaved: (jobId: number) => boolean;
  saveJob: (job: RemotiveJob) => boolean;
  removeSavedJob: (jobId: number) => void;
  toggleSaveJob: (job: RemotiveJob) => boolean;

  // Interviews
  interviews: InterviewItem[];
  addInterview: (data: Omit<InterviewItem, 'id' | 'createdAt'>) => InterviewItem;
  updateInterview: (id: string, patch: Partial<InterviewItem>) => void;
  toggleInterviewCompleted: (id: string) => void;
  deleteInterview: (id: string) => void;

  // Profile & Activity
  profile: UserProfile;
  updateProfile: (next: UserProfile) => void;
  activities: ActivityEntry[];

  // Data Management
  clearApplicationsData: () => void;
  clearSavedJobsData: () => void;
  exportCareerData: () => CareerExportPayload;
  importCareerData: (payload: CareerExportPayload) => void;
}

const CareerContext = createContext<CareerContextValue | null>(null);

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  const [applications, setApplications, appStorageMeta] = useLocalStorage<JobApplication[]>(
    APPLICATIONS_KEY,
    []
  );
  const [savedJobs, setSavedJobs, savedStorageMeta] = useLocalStorage<RemotiveJob[]>(
    SAVED_JOBS_KEY,
    []
  );
  const [interviews, setInterviews, interviewStorageMeta] = useLocalStorage<InterviewItem[]>(
    INTERVIEWS_KEY,
    []
  );
  const [profile, setProfile, profileStorageMeta] = useLocalStorage<UserProfile>(
    PROFILE_KEY,
    DEFAULT_PROFILE
  );
  const [activities, setActivities] = useLocalStorage<ActivityEntry[]>(ACTIVITIES_KEY, []);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastKind, title: string, message?: string) => {
      const id = generateId('toast');
      setToasts((prev) => [...prev.slice(-3), { id, type, title, message }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 4500);
    },
    [dismissToast]
  );

  const recordActivity = useCallback(
    (type: ActivityEntry['type'], title: string, detail: string) => {
      const entry: ActivityEntry = {
        id: generateId('act'),
        type,
        title,
        detail,
        timestamp: new Date().toISOString(),
      };
      setActivities((prev) => [entry, ...prev].slice(0, 30));
    },
    [setActivities]
  );

  const isJobApplied = useCallback(
    (job: Pick<RemotiveJob, 'id' | 'url' | 'title' | 'company_name'>) => {
      return applications.some(
        (app) =>
          (job.id && app.jobId === job.id) ||
          (job.url && app.jobUrl && app.jobUrl === job.url) ||
          (app.jobTitle.toLowerCase() === job.title.toLowerCase() &&
            app.companyName.toLowerCase() === job.company_name.toLowerCase())
      );
    },
    [applications]
  );

  const addApplication = useCallback(
    (data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => {
      const duplicate = applications.some(
        (app) =>
          (data.jobId && app.jobId === data.jobId) ||
          (data.jobUrl && app.jobUrl && app.jobUrl === data.jobUrl) ||
          (app.jobTitle.trim().toLowerCase() === data.jobTitle.trim().toLowerCase() &&
            app.companyName.trim().toLowerCase() === data.companyName.trim().toLowerCase())
      );

      if (duplicate) {
        addToast('info', 'Already tracked', `${data.jobTitle} at ${data.companyName} is already in My Applications.`);
        return { added: false, reason: 'Duplicate application entry.' };
      }

      const now = new Date().toISOString();
      const created: JobApplication = {
        ...data,
        id: generateId('app'),
        createdAt: now,
        updatedAt: now,
      };
      setApplications((prev) => [created, ...prev]);
      recordActivity(
        'application_added',
        `Applied to ${created.jobTitle}`,
        `${created.companyName} · ${created.status}`
      );
      addToast('success', 'Application added', `${created.jobTitle} at ${created.companyName}`);
      return { added: true, application: created };
    },
    [applications, setApplications, recordActivity, addToast]
  );

  const addApplicationFromJob = useCallback(
    (job: RemotiveJob) => {
      if (isJobApplied(job)) {
        addToast('info', 'Already tracked', `${job.title} at ${job.company_name} is already in your applications.`);
        return { added: false, reason: 'Duplicate application entry.' };
      }
      return addApplication({
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company_name,
        location: job.candidate_required_location || 'Remote',
        jobType: formatJobTypeLabel(job.job_type),
        category: job.category,
        appliedDate: getTodayDateInput(),
        status: 'Applied',
        jobUrl: job.url,
        notes: job.salary ? `Listed compensation: ${job.salary}` : '',
        followUpDate: '',
        salary: job.salary,
      });
    },
    [isJobApplied, addApplication, addToast]
  );

  const updateApplication = useCallback(
    (id: string, patch: Partial<JobApplication>) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id !== id) return app;
          const next = { ...app, ...patch, updatedAt: new Date().toISOString() };
          if (patch.status && patch.status !== app.status) {
            recordActivity(
              'status_changed',
              `Updated ${app.jobTitle} to ${patch.status}`,
              app.companyName
            );
          }
          return next;
        })
      );
      addToast('success', 'Application updated');
    },
    [setApplications, recordActivity, addToast]
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const target = applications.find((a) => a.id === id);
      if (!target || target.status === status) return;
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
        )
      );
      recordActivity('status_changed', `Moved ${target.jobTitle} to ${status}`, target.companyName);
      addToast('success', 'Status updated', `${target.companyName} · ${status}`);
    },
    [applications, setApplications, recordActivity, addToast]
  );

  const deleteApplication = useCallback(
    (id: string) => {
      const target = applications.find((a) => a.id === id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
      if (target) {
        addToast('info', 'Application removed', `${target.jobTitle} at ${target.companyName}`);
      }
    },
    [applications, setApplications, addToast]
  );

  const isJobSaved = useCallback(
    (jobId: number) => savedJobs.some((job) => job.id === jobId),
    [savedJobs]
  );

  const saveJob = useCallback(
    (job: RemotiveJob) => {
      if (savedJobs.some((item) => item.id === job.id)) {
        addToast('info', 'Already bookmarked', `${job.title} is already in Saved Jobs.`);
        return false;
      }
      setSavedJobs((prev) => [job, ...prev]);
      recordActivity('job_saved', `Saved ${job.title}`, job.company_name);
      addToast('success', 'Job saved', `${job.title} at ${job.company_name}`);
      return true;
    },
    [savedJobs, setSavedJobs, recordActivity, addToast]
  );

  const removeSavedJob = useCallback(
    (jobId: number) => {
      const target = savedJobs.find((j) => j.id === jobId);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
      if (target) {
        addToast('info', 'Bookmark removed', target.title);
      }
    },
    [savedJobs, setSavedJobs, addToast]
  );

  const toggleSaveJob = useCallback(
    (job: RemotiveJob) => {
      if (isJobSaved(job.id)) {
        removeSavedJob(job.id);
        return false;
      }
      return saveJob(job);
    },
    [isJobSaved, removeSavedJob, saveJob]
  );

  const addInterview = useCallback(
    (data: Omit<InterviewItem, 'id' | 'createdAt'>) => {
      const created: InterviewItem = {
        ...data,
        id: generateId('iv'),
        createdAt: new Date().toISOString(),
      };
      setInterviews((prev) =>
        [created, ...prev].sort(
          (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        )
      );
      recordActivity(
        'interview_scheduled',
        `Scheduled ${created.round} with ${created.companyName}`,
        created.position
      );
      addToast('success', 'Interview scheduled', `${created.companyName} · ${created.round}`);
      return created;
    },
    [setInterviews, recordActivity, addToast]
  );

  const updateInterview = useCallback(
    (id: string, patch: Partial<InterviewItem>) => {
      setInterviews((prev) =>
        prev
          .map((item) => (item.id === id ? { ...item, ...patch } : item))
          .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      );
      addToast('success', 'Interview updated');
    },
    [setInterviews, addToast]
  );

  const toggleInterviewCompleted = useCallback(
    (id: string) => {
      const target = interviews.find((i) => i.id === id);
      if (!target) return;
      const nextCompleted = !target.completed;
      setInterviews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, completed: nextCompleted } : item))
      );
      if (nextCompleted) {
        recordActivity(
          'interview_completed',
          `Completed ${target.round} with ${target.companyName}`,
          target.position
        );
      }
      addToast(
        'success',
        nextCompleted ? 'Interview marked completed' : 'Interview moved to upcoming',
        target.companyName
      );
    },
    [interviews, setInterviews, recordActivity, addToast]
  );

  const deleteInterview = useCallback(
    (id: string) => {
      const target = interviews.find((i) => i.id === id);
      setInterviews((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        addToast('info', 'Interview deleted', `${target.companyName} · ${target.round}`);
      }
    },
    [interviews, setInterviews, addToast]
  );

  const updateProfile = useCallback(
    (next: UserProfile) => {
      setProfile(next);
      recordActivity('profile_updated', 'Updated career profile preferences', next.headline || next.fullName || 'Workspace');
      addToast('success', 'Profile saved');
    },
    [setProfile, recordActivity, addToast]
  );

  const clearApplicationsData = useCallback(() => {
    setApplications([]);
    addToast('info', 'All applications cleared');
  }, [setApplications, addToast]);

  const clearSavedJobsData = useCallback(() => {
    setSavedJobs([]);
    addToast('info', 'All saved jobs cleared');
  }, [setSavedJobs, addToast]);

  const exportCareerData = useCallback((): CareerExportPayload => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      applications,
      savedJobs,
      interviews,
      activities,
    };
  }, [profile, applications, savedJobs, interviews, activities]);

  const importCareerData = useCallback(
    (payload: CareerExportPayload) => {
      setProfile(payload.profile);
      setApplications(payload.applications);
      setSavedJobs(payload.savedJobs);
      setInterviews(payload.interviews);
      setActivities(payload.activities);
      addToast(
        'success',
        'Workspace data imported',
        `${payload.applications.length} applications, ${payload.interviews.length} interviews, ${payload.savedJobs.length} saved jobs.`
      );
    },
    [setProfile, setApplications, setSavedJobs, setInterviews, setActivities, addToast]
  );

  const storageAvailable =
    appStorageMeta.storageAvailable &&
    savedStorageMeta.storageAvailable &&
    interviewStorageMeta.storageAvailable &&
    profileStorageMeta.storageAvailable;

  const storageError =
    appStorageMeta.storageError ||
    savedStorageMeta.storageError ||
    interviewStorageMeta.storageError ||
    profileStorageMeta.storageError;

  const value = useMemo<CareerContextValue>(
    () => ({
      storageAvailable,
      storageError,
      theme,
      isDark,
      toggleTheme,
      setTheme,
      toasts,
      addToast,
      dismissToast,
      applications,
      addApplication,
      addApplicationFromJob,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      isJobApplied,
      savedJobs,
      isJobSaved,
      saveJob,
      removeSavedJob,
      toggleSaveJob,
      interviews,
      addInterview,
      updateInterview,
      toggleInterviewCompleted,
      deleteInterview,
      profile,
      updateProfile,
      activities,
      clearApplicationsData,
      clearSavedJobsData,
      exportCareerData,
      importCareerData,
    }),
    [
      storageAvailable,
      storageError,
      theme,
      isDark,
      toggleTheme,
      setTheme,
      toasts,
      addToast,
      dismissToast,
      applications,
      addApplication,
      addApplicationFromJob,
      updateApplication,
      updateApplicationStatus,
      deleteApplication,
      isJobApplied,
      savedJobs,
      isJobSaved,
      saveJob,
      removeSavedJob,
      toggleSaveJob,
      interviews,
      addInterview,
      updateInterview,
      toggleInterviewCompleted,
      deleteInterview,
      profile,
      updateProfile,
      activities,
      clearApplicationsData,
      clearSavedJobsData,
      exportCareerData,
      importCareerData,
    ]
  );

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
};

export function useCareer(): CareerContextValue {
  const ctx = useContext(CareerContext);
  if (!ctx) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return ctx;
}
