import { useQuery } from '@tanstack/react-query';
import { QuestionApi, QUESTION_QUERY_KEYS } from '../question.api';
import { IQuestionFilter } from '@/types/admin/question.type';

export function useQuestions(filter: IQuestionFilter) {
  return useQuery({
    queryKey: QUESTION_QUERY_KEYS.list(filter),
    queryFn: () => QuestionApi.getQuestions(filter),
  });
}
