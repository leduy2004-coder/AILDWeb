import { useQuery } from '@tanstack/react-query';
import { ADMIN_BADGE_QUERY_KEYS, AdminBadgeApi } from '../admin-badge.api';

/** Safety net only: changes normally arrive through the live stream (useAdminBadgeStream) */
const POLL_INTERVAL_MS = 5 * 60_000;

/** @param enabled false for menu items without a dot; one shared request serves every item */
export function useAdminBadges(enabled = true) {
  return useQuery({
    queryKey: ADMIN_BADGE_QUERY_KEYS.all,
    queryFn: () => AdminBadgeApi.getAdminBadges(),
    enabled,
    select: (res) => res.result,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: true,
    // A failing badge call must never get in the way of the menu
    retry: false,
  });
}
