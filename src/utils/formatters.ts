import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  CareerExportPayload,
  InterviewItem,
  JobApplication,
  RemotiveJob,
  UserProfile,
} from '../types/career';

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(dateTimeString: string | undefined): string {
  if (!dateTimeString) return 'Not scheduled';
  const date = new Date(dateTimeString);
  if (Number.isNaN(date.getTime())) return dateTimeString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function getInterviewCountdown(dateTimeString: string): {
  label: string;
  isPast: boolean;
  isSoon: boolean;
} {
  const target = new Date(dateTimeString);
  if (Number.isNaN(target.getTime())) {
    return { label: 'Invalid date', isPast: false, isSoon: false };
  }
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) {
    return { label: 'Scheduled time passed', isPast: true, isSoon: false };
  }
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins = totalMinutes % 60;

  if (days > 0) {
    return {
      label: `In ${days}d ${hours}h`,
      isPast: false,
      isSoon: days <= 2,
    };
  }
  if (hours > 0) {
    return {
      label: `In ${hours}h ${mins}m`,
      isPast: false,
      isSoon: true,
    };
  }
  return {
    label: `In ${Math.max(1, mins)}m`,
    isPast: false,
    isSoon: true,
  };
}

export function formatJobTypeLabel(jobType: string | undefined): string {
  if (!jobType) return 'Unspecified';
  const normalized = jobType.trim().toLowerCase().replace(/[_-]+/g, ' ');
  return normalized.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getTodayDateInput(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return true;
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateCareerImportPayload(
  raw: unknown
): { valid: true; data: CareerExportPayload } | { valid: false; error: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, error: 'Imported file must contain a JSON object.' };
  }

  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.applications)) {
    return { valid: false, error: 'Missing or invalid "applications" array in JSON file.' };
  }

  const validStatuses = new Set<string>(APPLICATION_STATUSES);
  const applications: JobApplication[] = [];
  for (const item of obj.applications) {
    if (!item || typeof item !== 'object') {
      return { valid: false, error: 'Invalid application record found in JSON.' };
    }
    const app = item as Record<string, unknown>;
    if (typeof app.jobTitle !== 'string' || typeof app.companyName !== 'string') {
      return { valid: false, error: 'Each application must include string "jobTitle" and "companyName".' };
    }
    const status = typeof app.status === 'string' && validStatuses.has(app.status)
      ? (app.status as ApplicationStatus)
      : 'Applied';

    applications.push({
      id: typeof app.id === 'string' && app.id ? app.id : generateId('app'),
      jobId: typeof app.jobId === 'number' ? app.jobId : undefined,
      jobTitle: app.jobTitle.trim(),
      companyName: app.companyName.trim(),
      location: typeof app.location === 'string' ? app.location : 'Remote',
      jobType: typeof app.jobType === 'string' ? app.jobType : 'Full Time',
      category: typeof app.category === 'string' ? app.category : undefined,
      appliedDate: typeof app.appliedDate === 'string' ? app.appliedDate : getTodayDateInput(),
      status,
      jobUrl: typeof app.jobUrl === 'string' && isValidUrl(app.jobUrl) ? app.jobUrl : '',
      notes: typeof app.notes === 'string' ? app.notes : '',
      followUpDate: typeof app.followUpDate === 'string' ? app.followUpDate : '',
      salary: typeof app.salary === 'string' ? app.salary : undefined,
      createdAt: typeof app.createdAt === 'string' ? app.createdAt : new Date().toISOString(),
      updatedAt: typeof app.updatedAt === 'string' ? app.updatedAt : new Date().toISOString(),
    });
  }

  const interviews: InterviewItem[] = [];
  if (obj.interviews !== undefined) {
    if (!Array.isArray(obj.interviews)) {
      return { valid: false, error: 'Invalid "interviews" array in JSON file.' };
    }
    for (const item of obj.interviews) {
      if (!item || typeof item !== 'object') continue;
      const iv = item as Record<string, unknown>;
      if (typeof iv.companyName !== 'string' || typeof iv.position !== 'string') continue;
      const mode = iv.mode === 'Online' || iv.mode === 'In-person' || iv.mode === 'Phone' ? iv.mode : 'Online';
      interviews.push({
        id: typeof iv.id === 'string' && iv.id ? iv.id : generateId('iv'),
        applicationId: typeof iv.applicationId === 'string' ? iv.applicationId : undefined,
        companyName: iv.companyName.trim(),
        position: iv.position.trim(),
        round: typeof iv.round === 'string' ? iv.round : 'Interview',
        mode,
        dateTime: typeof iv.dateTime === 'string' ? iv.dateTime : new Date().toISOString().slice(0, 16),
        locationOrLink: typeof iv.locationOrLink === 'string' ? iv.locationOrLink : '',
        notes: typeof iv.notes === 'string' ? iv.notes : '',
        completed: Boolean(iv.completed),
        createdAt: typeof iv.createdAt === 'string' ? iv.createdAt : new Date().toISOString(),
      });
    }
  }

  const savedJobs: RemotiveJob[] = [];
  if (obj.savedJobs !== undefined) {
    if (!Array.isArray(obj.savedJobs)) {
      return { valid: false, error: 'Invalid "savedJobs" array in JSON file.' };
    }
    for (const item of obj.savedJobs) {
      if (!item || typeof item !== 'object') continue;
      const j = item as Record<string, unknown>;
      if (typeof j.id !== 'number' || typeof j.title !== 'string' || typeof j.company_name !== 'string') continue;
      savedJobs.push({
        id: j.id,
        url: typeof j.url === 'string' && isValidUrl(j.url) ? j.url : 'https://remotive.com',
        title: j.title,
        company_name: j.company_name,
        company_logo: typeof j.company_logo === 'string' ? j.company_logo : undefined,
        category: typeof j.category === 'string' ? j.category : 'General',
        tags: Array.isArray(j.tags) ? j.tags.filter((t): t is string => typeof t === 'string') : [],
        job_type: typeof j.job_type === 'string' ? j.job_type : 'full_time',
        publication_date: typeof j.publication_date === 'string' ? j.publication_date : '',
        candidate_required_location:
          typeof j.candidate_required_location === 'string' ? j.candidate_required_location : 'Anywhere',
        salary: typeof j.salary === 'string' ? j.salary : undefined,
        description: typeof j.description === 'string' ? j.description : '',
      });
    }
  }

  const rawProfile = (obj.profile && typeof obj.profile === 'object' ? obj.profile : {}) as Record<string, unknown>;
  const profile: UserProfile = {
    fullName: typeof rawProfile.fullName === 'string' ? rawProfile.fullName : '',
    email: typeof rawProfile.email === 'string' ? rawProfile.email : '',
    headline: typeof rawProfile.headline === 'string' ? rawProfile.headline : '',
    careerInterests: Array.isArray(rawProfile.careerInterests)
      ? rawProfile.careerInterests.filter((v): v is string => typeof v === 'string')
      : [],
    skills: Array.isArray(rawProfile.skills)
      ? rawProfile.skills.filter((v): v is string => typeof v === 'string')
      : [],
    preferredLocations: Array.isArray(rawProfile.preferredLocations)
      ? rawProfile.preferredLocations.filter((v): v is string => typeof v === 'string')
      : [],
    preferredEmploymentType:
      typeof rawProfile.preferredEmploymentType === 'string' ? rawProfile.preferredEmploymentType : 'Any',
  };

  return {
    valid: true,
    data: {
      version: 1,
      exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
      profile,
      applications,
      savedJobs,
      interviews,
      activities: Array.isArray(obj.activities) ? (obj.activities as CareerExportPayload['activities']) : [],
    },
  };
}
