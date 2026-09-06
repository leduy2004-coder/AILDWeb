import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';
import { IResourceRequest } from '@/types/admin/resource.type';

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IResourceRequest }) => resourceApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.all });
    },
  });
};
