import { useQuery } from '@tanstack/react-query';
import { OverviewApi } from '../overview.api';

/** A bar of the activity chart: a month (day = null) or a day of a month */
export interface IActivityPeriod {
  year: number;
  month: number | null;
  day: number | null;
}

/** @param period null while no bar is selected (modal closed) */
export function useGetActivitySubmissions(period: IActivityPeriod | null) {
  return useQuery({
    queryKey: ['admin_overview', 'activity_submissions', period?.year, period?.month, period?.day],
    queryFn: () => OverviewApi.getActivitySubmissions(period!.year, period!.month, period!.day),
    enabled: period !== null,
  });
}
