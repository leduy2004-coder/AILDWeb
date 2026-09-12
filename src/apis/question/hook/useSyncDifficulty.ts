import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionApi, QUESTION_QUERY_KEYS } from '../question.api';

export const useSyncDifficulty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => QuestionApi.syncDifficulty(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
    },
  });
};
