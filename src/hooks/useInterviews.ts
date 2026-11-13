import { useCareer } from '../context/CareerContext';

export function useInterviews() {
  const {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  } = useCareer();

  return {
    interviews,
    addInterview,
    updateInterview,
    toggleInterviewCompleted,
    deleteInterview,
  };
}
