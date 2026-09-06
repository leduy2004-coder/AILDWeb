import { useQuery } from '@tanstack/react-query';
import { QuestionApi, QUESTION_QUERY_KEYS } from '../question.api';

export function useQuestion(id: number) {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.detail(id),
    queryFn: () => QuestionApi.getQuestion(id),
    enabled: !!id,
  });
}
