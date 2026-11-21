import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

/** @param enabled only fetch while the list modal is open */
export function useGetImprovementList(enabled: boolean) {
  return useQuery({
    queryKey: ['admin_overview', 'improvement'],
    queryFn: OverviewApi.getImprovementList,
    enabled,
  });
}
