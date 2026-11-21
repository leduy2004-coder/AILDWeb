import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

/** @param domainId null while no domain is selected (modal closed) */
export function useGetDomainDetail(domainId: number | null) {
  return useQuery({
    queryKey: ['admin_overview', 'domain', domainId],
    queryFn: () => OverviewApi.getDomainDetail(domainId as number),
    enabled: domainId !== null,
  });
}
