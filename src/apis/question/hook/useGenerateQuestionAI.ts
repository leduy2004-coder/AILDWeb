import { useMutation } from '@tanstack/react-query';
import { QuestionApi } from '../question.api';
import { IAIGenerateQuestionRequest } from '@/types/admin/question.type';

export const useGenerateQuestionAI = () => {
  return useMutation({
    mutationFn: (data: IAIGenerateQuestionRequest) => QuestionApi.generateQuestionAI(data),
  });
};
