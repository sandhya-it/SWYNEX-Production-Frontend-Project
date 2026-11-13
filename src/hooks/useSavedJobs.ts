import { useCareer } from '../context/CareerContext';

export function useSavedJobs() {
  const {
    savedJobs,
    isJobSaved,
    saveJob,
    removeSavedJob,
    toggleSaveJob,
    clearSavedJobsData,
  } = useCareer();

  return {
    savedJobs,
    isJobSaved,
    saveJob,
    removeSavedJob,
    toggleSaveJob,
    clearSavedJobsData,
  };
}
