import { useQuery } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';

interface UseGetResourcesProps {
  domainId?: number | null;
  targetLevelId?: number | null;
  keyword?: string;
  page?: number;
  size?: number;
}

export const useGetResources = (filter: UseGetResourcesProps) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filter),
    queryFn: () => resourceApi.getResources(filter)
  });
};
