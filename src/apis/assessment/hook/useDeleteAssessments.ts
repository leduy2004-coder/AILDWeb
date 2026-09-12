import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AdminAssessmentApi,
  ADMIN_ASSESSMENT_QUERY_KEYS,
} from '../admin-assessment.api';

export function useDeleteAssessments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => AdminAssessmentApi.deleteAssessments(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_ASSESSMENT_QUERY_KEYS.all,
      });
    },
  });
}
