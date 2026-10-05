import { useQuery } from '@tanstack/react-query';
import { ConfigApi, CONFIG_QUERY_KEYS } from '../config.api';

export function useGetLevels() {
  return useQuery({
    queryKey: CONFIG_QUERY_KEYS.levels,
    queryFn: () => ConfigApi.getLevels(),
  });
}
