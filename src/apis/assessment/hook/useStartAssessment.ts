import { useMutation } from '@tanstack/react-query';
import { AssessmentApi } from '../assessment.api';

export function useStartAssessment() {
  return useMutation({
    mutationFn: () => AssessmentApi.startAssessment(),
  });
}
