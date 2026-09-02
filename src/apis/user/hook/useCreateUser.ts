import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '../user.api';
import { SEARCH_USERS_QUERY_KEY } from './useSearchUsers';
import { GET_USER_STATS_QUERY_KEY } from './useGetUserStats';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GET_USER_STATS_QUERY_KEY] });
    },
  });
}
