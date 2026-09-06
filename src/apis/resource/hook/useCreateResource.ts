import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';
import { IResourceRequest } from '@/types/admin/resource.type';

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IResourceRequest) => resourceApi.createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESOURCE_QUERY_KEYS.all });
    },
  });
};
