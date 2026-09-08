import { useMutation } from '@tanstack/react-query';
import { AssessmentApi, ISubmitAnswerRequest } from '../assessment.api';

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: ({ assessmentId, data }: { assessmentId: number; data: ISubmitAnswerRequest }) =>
      AssessmentApi.submitAnswer(assessmentId, data),
  });
}
