import { useQuery } from '@tanstack/react-query';
import { UserApi } from '../user.api';

export const GET_USER_STATS_QUERY_KEY = 'GET_USER_STATS_QUERY_KEY';

export function useGetUserStats() {
  return useQuery({
    queryKey: [GET_USER_STATS_QUERY_KEY],
    queryFn: () => UserApi.getUserStats(),
  });
}
