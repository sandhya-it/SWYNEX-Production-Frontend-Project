import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { clearJobsCache, fetchRemotiveJobs, JobApiError } from '../services/jobApi';
import { JobSearchFilters, RemotiveJob } from '../types/career';
import { useLocalStorage } from './useLocalStorage';

const SEARCH_HISTORY_KEY = 'careertrack_search_history_v1';

export const DEFAULT_JOB_FILTERS: JobSearchFilters = {
  search: '',
  category: 'All',
  jobType: 'All',
  remoteOnly: false,
  location: '',
  sortBy: 'newest',
};

export function useJobs(initialLimit = 60) {
  const [rawJobs, setRawJobs] = useState<RemotiveJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [filters, setFilters] = useState<JobSearchFilters>(DEFAULT_JOB_FILTERS);
  const [activeApiQuery, setActiveApiQuery] = useState<string>('');
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>(SEARCH_HISTORY_KEY, []);
  const abortRef = useRef<AbortController | null>(null);

  const loadJobs = useCallback(
    async (queryText: string, forceRefresh = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchRemotiveJobs({
          search: queryText,
          limit: initialLimit,
          forceRefresh,
          signal: controller.signal,
        });
        setRawJobs(result.jobs);
        setFromCache(result.fromCache);
        setLastFetchedAt(result.fetchedAt);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        if (err instanceof JobApiError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while loading opportunities. Please try again.');
        }
        setRawJobs([]);
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [initialLimit]
  );

  useEffect(() => {
    void loadJobs(activeApiQuery, false);
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [activeApiQuery, loadJobs]);

  const submitSearch = useCallback(
    (term: string) => {
      const cleaned = term.trim();
      setFilters((prev) => ({ ...prev, search: term }));
      setActiveApiQuery(cleaned);
      if (cleaned) {
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item.toLowerCase() !== cleaned.toLowerCase());
          return [cleaned, ...filtered].slice(0, 8);
        });
      }
    },
    [setSearchHistory]
  );

  const retry = useCallback(() => {
    void loadJobs(activeApiQuery, true);
  }, [activeApiQuery, loadJobs]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_JOB_FILTERS);
    setActiveApiQuery('');
  }, []);

  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    clearJobsCache();
  }, [setSearchHistory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    rawJobs.forEach((job) => {
      if (job.category) set.add(job.category);
    });
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rawJobs]);

  const jobTypes = useMemo(() => {
    const set = new Set<string>();
    rawJobs.forEach((job) => {
      if (job.job_type) set.add(job.job_type);
    });
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [rawJobs]);

  const filteredJobs = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();
    const locationLower = filters.location.trim().toLowerCase();

    const matched = rawJobs.filter((job) => {
      if (filters.category !== 'All' && job.category !== filters.category) {
        return false;
      }
      if (filters.jobType !== 'All' && job.job_type !== filters.jobType) {
        return false;
      }
      if (filters.remoteOnly) {
        const loc = job.candidate_required_location.toLowerCase();
        if (!loc.includes('anywhere') && !loc.includes('worldwide') && !loc.includes('remote')) {
          return false;
        }
      }
      if (locationLower && !job.candidate_required_location.toLowerCase().includes(locationLower)) {
        return false;
      }
      if (searchLower) {
        const haystack = [
          job.title,
          job.company_name,
          job.category,
          job.candidate_required_location,
          ...job.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(searchLower)) {
          return false;
        }
      }
      return true;
    });

    const sorted = [...matched];
    sorted.sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime();
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'company_asc':
          return a.company_name.localeCompare(b.company_name);
        case 'newest':
        default:
          return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
      }
    });
    return sorted;
  }, [rawJobs, filters]);

  return {
    jobs: filteredJobs,
    totalLoaded: rawJobs.length,
    loading,
    error,
    fromCache,
    lastFetchedAt,
    filters,
    setFilters,
    categories,
    jobTypes,
    searchHistory,
    submitSearch,
    retry,
    resetFilters,
    clearSearchHistory,
  };
}
