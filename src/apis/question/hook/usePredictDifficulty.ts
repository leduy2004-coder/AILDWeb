import { useMutation } from '@tanstack/react-query';
import { predictDifficulty } from '../question.api';
import { IQuestionRequest } from '@/types/admin/question.type';

export const usePredictDifficulty = () => {
  return useMutation({
    mutationFn: (data: IQuestionRequest) => predictDifficulty(data),
  });
};
