import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

/** @param levelId null while no level is selected (modal closed); 0 = not even the first level */
export function useGetLevelDetail(levelId: number | null) {
  return useQuery({
    queryKey: ['admin_overview', 'level', levelId],
    queryFn: () => OverviewApi.getLevelDetail(levelId as number),
    enabled: levelId !== null,
  });
}
