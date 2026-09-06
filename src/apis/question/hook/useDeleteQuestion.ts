import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionApi, QUESTION_QUERY_KEYS } from '../question.api';

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: QuestionApi.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
    },
  });
}
