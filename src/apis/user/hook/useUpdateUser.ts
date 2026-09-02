import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserApi } from '../user.api';
import { SEARCH_USERS_QUERY_KEY } from './useSearchUsers';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEARCH_USERS_QUERY_KEY] });
    },
  });
}
