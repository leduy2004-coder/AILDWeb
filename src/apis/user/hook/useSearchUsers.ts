import { useQuery } from '@tanstack/react-query';
import { UserApi } from '../user.api';

export const SEARCH_USERS_QUERY_KEY = 'SEARCH_USERS_QUERY_KEY';

export function useSearchUsers(page: number, size: number, name?: string, email?: string) {
  return useQuery({
    queryKey: [SEARCH_USERS_QUERY_KEY, page, size, name, email],
    queryFn: () => UserApi.searchUsers(page, size, name, email),
  });
}
