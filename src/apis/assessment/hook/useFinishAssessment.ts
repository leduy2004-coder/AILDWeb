import { useMutation } from '@tanstack/react-query';
import { AssessmentApi } from '../assessment.api';

export function useFinishAssessment() {
  return useMutation({
    mutationFn: (assessmentId: number) => AssessmentApi.finishAssessment(assessmentId),
  });
}
