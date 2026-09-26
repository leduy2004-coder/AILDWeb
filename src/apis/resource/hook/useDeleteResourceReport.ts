import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi } from '../resource.api';
import { RESOURCE_QUERY_KEYS } from '../resource.api';

export const useDeleteResourceReport = (resourceId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reportId: number) => resourceApi.deleteResourceReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', resourceId, 'reports'] });
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.all });
    },
  });
};
