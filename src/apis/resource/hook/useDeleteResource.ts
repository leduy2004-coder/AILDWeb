import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourceApi.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.all });
    },
  });
};
