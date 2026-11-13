import { RemotiveJob } from '../types/career';
import { safeReadStorage, safeRemoveStorage, safeWriteStorage } from '../utils/storage';

const REMOTIVE_BASE_URL = 'https://remotive.com/api/remote-jobs';
const CACHE_STORAGE_KEY = 'careertrack_remotive_cache_v1';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours to respect Remotive API limits (max ~4 calls/day)

interface CachedEntry {
  fetchedAt: number;
  jobs: RemotiveJob[];
}

type CacheStore = Record<string, CachedEntry>;

const memoryCache = new Map<string, CachedEntry>();

export class JobApiError extends Error {
  public readonly status?: number;
  public readonly code: 'NETWORK' | 'NOT_FOUND' | 'RATE_LIMIT' | 'FORBIDDEN' | 'SERVER' | 'INVALID_JSON' | 'UNKNOWN';

  constructor(
    message: string,
    code: JobApiError['code'],
    status?: number
  ) {
    super(message);
    this.name = 'JobApiError';
    this.code = code;
    this.status = status;
  }
}

function normalizeCacheKey(searchQuery: string, limit: number): string {
  return `${searchQuery.trim().toLowerCase() || '__all__'}::${limit}`;
}

function readCachedJobs(key: string): { jobs: RemotiveJob[]; fetchedAt: number } | null {
  const now = Date.now();
  const memHit = memoryCache.get(key);
  if (memHit && now - memHit.fetchedAt < CACHE_TTL_MS) {
    return { jobs: memHit.jobs, fetchedAt: memHit.fetchedAt };
  }

  const { value } = safeReadStorage<CacheStore>(CACHE_STORAGE_KEY, {});
  const diskHit = value[key];
  if (diskHit && Array.isArray(diskHit.jobs) && now - diskHit.fetchedAt < CACHE_TTL_MS) {
    memoryCache.set(key, diskHit);
    return { jobs: diskHit.jobs, fetchedAt: diskHit.fetchedAt };
  }

  return null;
}

function writeCachedJobs(key: string, jobs: RemotiveJob[]): number {
  const fetchedAt = Date.now();
  const entry: CachedEntry = { fetchedAt, jobs };
  memoryCache.set(key, entry);

  const { value } = safeReadStorage<CacheStore>(CACHE_STORAGE_KEY, {});
  const pruned: CacheStore = {};
  for (const [k, v] of Object.entries(value)) {
    if (v && fetchedAt - v.fetchedAt < CACHE_TTL_MS) {
      pruned[k] = v;
    }
  }
  pruned[key] = entry;
  safeWriteStorage(CACHE_STORAGE_KEY, pruned);
  return fetchedAt;
}

export function clearJobsCache(): void {
  memoryCache.clear();
  safeRemoveStorage(CACHE_STORAGE_KEY);
}

function validateAndSanitizeJobs(payload: unknown): RemotiveJob[] {
  if (!payload || typeof payload !== 'object') {
    throw new JobApiError(
      'Unable to process job data returned by Remotive.',
      'INVALID_JSON'
    );
  }

  const record = payload as Record<string, unknown>;
  if (!Array.isArray(record.jobs)) {
    throw new JobApiError(
      'Unexpected job feed format received from Remotive.',
      'INVALID_JSON'
    );
  }

  return record.jobs
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .filter((item) => typeof item.id === 'number' && typeof item.title === 'string' && typeof item.url === 'string')
    .map((item) => ({
      id: item.id as number,
      url: String(item.url),
      title: String(item.title).trim(),
      company_name: typeof item.company_name === 'string' && item.company_name.trim()
        ? item.company_name.trim()
        : 'Confidential Company',
      company_logo: typeof item.company_logo === 'string' && item.company_logo.trim()
        ? item.company_logo.trim()
        : undefined,
      category: typeof item.category === 'string' && item.category.trim()
        ? item.category.trim()
        : 'Other',
      tags: Array.isArray(item.tags)
        ? item.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        : [],
      job_type: typeof item.job_type === 'string' && item.job_type.trim()
        ? item.job_type.trim()
        : 'full_time',
      publication_date: typeof item.publication_date === 'string' ? item.publication_date : '',
      candidate_required_location:
        typeof item.candidate_required_location === 'string' && item.candidate_required_location.trim()
          ? item.candidate_required_location.trim()
          : 'Remote',
      salary: typeof item.salary === 'string' && item.salary.trim() ? item.salary.trim() : undefined,
      description: typeof item.description === 'string' ? item.description : '',
    }));
}

export interface FetchJobsOptions {
  search?: string;
  limit?: number;
  forceRefresh?: boolean;
  signal?: AbortSignal;
}

export interface FetchJobsResult {
  jobs: RemotiveJob[];
  fromCache: boolean;
  fetchedAt: number;
}

export async function fetchRemotiveJobs(options: FetchJobsOptions = {}): Promise<FetchJobsResult> {
  const { search = '', limit = 60, forceRefresh = false, signal } = options;
  const cacheKey = normalizeCacheKey(search, limit);

  if (!forceRefresh) {
    const cached = readCachedJobs(cacheKey);
    if (cached) {
      return { jobs: cached.jobs, fromCache: true, fetchedAt: cached.fetchedAt };
    }
  }

  const params = new URLSearchParams();
  if (search.trim()) {
    params.set('search', search.trim());
  }
  params.set('limit', String(limit));

  const requestUrl = `${REMOTIVE_BASE_URL}?${params.toString()}`;

  let response: Response;
  try {
    response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new JobApiError(
      'Unable to connect. Please check your internet connection.',
      'NETWORK'
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new JobApiError(
        'The requested Remotive jobs endpoint could not be found (404).',
        'NOT_FOUND',
        404
      );
    }
    if (response.status === 429) {
      throw new JobApiError(
        'Too many requests. Please try again later.',
        'RATE_LIMIT',
        429
      );
    }
    if (response.status === 403) {
      throw new JobApiError(
        'Access to the job feed was temporarily restricted or rate-limited (403). Please try again later.',
        'FORBIDDEN',
        403
      );
    }
    if (response.status >= 500) {
      throw new JobApiError(
        'The job feed server encountered an error. Please try again in a few moments.',
        'SERVER',
        response.status
      );
    }
    throw new JobApiError(
      `Unable to load opportunities (HTTP ${response.status}).`,
      'UNKNOWN',
      response.status
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = await response.json();
  } catch {
    throw new JobApiError(
      'Unable to process the response from the job feed. Invalid JSON received.',
      'INVALID_JSON'
    );
  }

  const jobs = validateAndSanitizeJobs(parsedJson);
  const fetchedAt = writeCachedJobs(cacheKey, jobs);
  return { jobs, fromCache: false, fetchedAt };
}
