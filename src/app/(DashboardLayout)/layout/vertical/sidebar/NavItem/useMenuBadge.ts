import { useAdminBadges, useMarkAdminBadgeRead } from '@/apis/admin-badge';
import { AdminBadgeType, IAdminBadges } from '@/types/admin/admin-badge.type';

/** Admin menu codes (MenuItems.ts) that can show the green "something new" dot */
const MENU_BADGE: Record<string, { type: AdminBadgeType; field: keyof IAdminBadges }> = {
  SUBMISSION: { type: 'SUBMISSIONS', field: 'submissions' },
  RESOURCE: { type: 'RESOURCE_REPORTS', field: 'resourceReports' },
  USER: { type: 'USERS', field: 'users' },
};

/** Whether a menu item has something new, and a callback that marks it read for every admin */
export function useMenuBadge(code?: string) {
  const badge = code ? MENU_BADGE[code] : undefined;
  const { data } = useAdminBadges(Boolean(badge));
  const markRead = useMarkAdminBadgeRead();

  const unread = Boolean(badge && data?.[badge.field]);

  const clear = () => {
    if (badge && unread) markRead.mutate(badge.type);
  };

  return { unread, clear };
}
