import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QuestionApi, QUESTION_QUERY_KEYS } from '../question.api';
import { IQuestionRequest } from '@/types/admin/question.type';

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IQuestionRequest }) => QuestionApi.updateQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: QUESTION_QUERY_KEYS.detail(variables.id) });
    },
  });
}
