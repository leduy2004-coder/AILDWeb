import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

export function useGetAttention() {
  return useQuery({
    queryKey: ['admin_overview', 'attention'],
    queryFn: OverviewApi.getAttention,
  });
}
