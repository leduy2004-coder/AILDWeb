import { useQuery } from '@tanstack/react-query';
import { ConfigApi, CONFIG_QUERY_KEYS } from '../config.api';

export function useGetDomains() {
  return useQuery({
    queryKey: CONFIG_QUERY_KEYS.domains,
    queryFn: () => ConfigApi.getDomains(),
  });
}
