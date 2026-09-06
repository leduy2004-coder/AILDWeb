import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteResources, RESOURCE_QUERY_KEYS } from '../resource.api';

export const useBulkDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteResources(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.all });
    },
  });
};
