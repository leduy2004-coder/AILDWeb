import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AssessmentApi } from '../assessment.api';
import { IApiResponse } from '@/types/shared';
import { IChatRequest, IChatResponse } from '@/types/student/assessment.type';

interface UseChatWithAIParams {
  assessmentId: number;
}

export const useChatWithAI = ({
  assessmentId,
}: UseChatWithAIParams): UseMutationResult<
  IApiResponse<IChatResponse>,
  Error,
  IChatRequest
> => {
  return useMutation({
    mutationFn: (data: IChatRequest) => AssessmentApi.chatWithAI(assessmentId, data),
  });
};
