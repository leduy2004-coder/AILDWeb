import { useQuery } from '@tanstack/react-query';
import { resourceApi } from '../resource.api';

export const useGetResourceReports = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['resources', id, 'reports'],
    queryFn: () => resourceApi.getResourceReports(id),
    enabled,
  });
};
