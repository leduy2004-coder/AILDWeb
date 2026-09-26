import { useQuery } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';

export const useGetResourceLikes = (id: number | null) => {
  return useQuery({
    queryKey: [...RESOURCE_QUERY_KEYS.all, id, 'likes'],
    queryFn: () => resourceApi.getResourceLikes(id!),
    enabled: !!id,
  });
};
