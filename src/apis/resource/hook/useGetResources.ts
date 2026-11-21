import { useQuery } from '@tanstack/react-query';
import { resourceApi, RESOURCE_QUERY_KEYS } from '../resource.api';
import { ResourceType } from '@/utils/resource.util';

interface UseGetResourcesProps {
  domainId?: number | null;
  targetLevelId?: number | null;
  keyword?: string;
  type?: ResourceType | null;
  page?: number;
  size?: number;
}

export const useGetResources = (filter: UseGetResourcesProps) => {
  return useQuery({
    queryKey: RESOURCE_QUERY_KEYS.list(filter),
    queryFn: () => resourceApi.getResources(filter)
  });
};
