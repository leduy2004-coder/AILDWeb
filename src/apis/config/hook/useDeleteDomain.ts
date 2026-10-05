import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfigApi, CONFIG_QUERY_KEYS } from '../config.api';

export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ConfigApi.deleteDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.domains });
    },
  });
}
