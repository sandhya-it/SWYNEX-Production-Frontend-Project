export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Offer Received'
  | 'Rejected';

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Offer Received',
  'Rejected',
];

export type InterviewMode = 'Online' | 'In-person' | 'Phone';

export interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary?: string;
  description: string;
}

export interface JobApplication {
  id: string;
  jobId?: number;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  category?: string;
  appliedDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  jobUrl: string;
  notes: string;
  followUpDate: string; // YYYY-MM-DD or ''
  salary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewItem {
  id: string;
  applicationId?: string;
  companyName: string;
  position: string;
  round: string;
  mode: InterviewMode;
  dateTime: string; // ISO local datetime string YYYY-MM-DDTHH:mm
  locationOrLink: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface ActivityEntry {
  id: string;
  type: 'application_added' | 'status_changed' | 'interview_scheduled' | 'interview_completed' | 'job_saved' | 'profile_updated';
  title: string;
  detail: string;
  timestamp: string;
}

export interface UserProfile {
  fullName: string;
  email: string;
  headline: string;
  careerInterests: string[];
  skills: string[];
  preferredLocations: string[];
  preferredEmploymentType: string;
}

export interface JobSearchFilters {
  search: string;
  category: string;
  jobType: string;
  remoteOnly: boolean;
  location: string;
  sortBy: 'newest' | 'oldest' | 'title_asc' | 'company_asc';
}

export type ToastKind = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastKind;
  title: string;
  message?: string;
}

export interface CareerExportPayload {
  version: 1;
  exportedAt: string;
  profile: UserProfile;
  applications: JobApplication[];
  savedJobs: RemotiveJob[];
  interviews: InterviewItem[];
  activities: ActivityEntry[];
}
