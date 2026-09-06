import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestions, QUESTION_QUERY_KEYS } from '../question.api';

export const useBulkDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteQuestions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
    },
  });
};
