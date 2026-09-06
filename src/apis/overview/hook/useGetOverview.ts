import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

export function useGetOverview() {
  return useQuery({
    queryKey: ['admin_overview'],
    queryFn: OverviewApi.getOverview,
  });
}
