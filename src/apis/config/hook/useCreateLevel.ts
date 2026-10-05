import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConfigApi, CONFIG_QUERY_KEYS } from '../config.api';

export function useCreateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ConfigApi.createLevel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEYS.levels });
    },
  });
}
