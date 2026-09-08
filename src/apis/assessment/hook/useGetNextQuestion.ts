import { useQuery } from '@tanstack/react-query';
import { AssessmentApi, ASSESSMENT_QUERY_KEYS } from '../assessment.api';

export function useGetNextQuestion(assessmentId: number | null, enabled = true) {
  return useQuery({
    queryKey: ASSESSMENT_QUERY_KEYS.nextQuestion(assessmentId ?? 0),
    queryFn: () => AssessmentApi.getNextQuestion(assessmentId!),
    enabled: !!assessmentId && enabled,
  });
}
