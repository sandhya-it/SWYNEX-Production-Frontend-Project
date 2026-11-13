import { useCareer } from '../context/CareerContext';

export function useApplications() {
  const {
    applications,
    addApplication,
    addApplicationFromJob,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    isJobApplied,
    clearApplicationsData,
  } = useCareer();

  return {
    applications,
    addApplication,
    addApplicationFromJob,
    updateApplication,
    updateApplicationStatus,
    deleteApplication,
    isJobApplied,
    clearApplicationsData,
  };
}
