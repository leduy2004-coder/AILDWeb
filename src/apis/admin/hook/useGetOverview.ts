import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

export const GET_OVERVIEW_QUERY_KEY = 'GET_OVERVIEW_QUERY_KEY';

export function useGetOverview() {
  return useQuery({
    queryKey: [GET_OVERVIEW_QUERY_KEY],
    queryFn: () => OverviewApi.getOverview(),
  });
}
