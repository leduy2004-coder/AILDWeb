import { useQuery } from '@tanstack/react-query';
import { UserApi } from '../user.api';

export const GET_USER_BY_ID_QUERY_KEY = 'GET_USER_BY_ID';

export function useGetUserById(id?: number) {
  return useQuery({
    queryKey: [GET_USER_BY_ID_QUERY_KEY, id],
    queryFn: () => UserApi.getUserById(id!),
    enabled: !!id,
    staleTime: 0,
    gcTime: 0,
  });
}
