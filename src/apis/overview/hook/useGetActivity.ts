import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

/** @param month 1-12 for that month by day; null for the whole year by month */
export function useGetActivity(year: number, month: number | null) {
  return useQuery({
    queryKey: ['admin_overview', 'activity', year, month],
    queryFn: () => OverviewApi.getActivity(year, month),
    // Keep the previous chart while another year/month loads, instead of flashing empty
    placeholderData: keepPreviousData,
  });
}
