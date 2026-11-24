import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminBadgeType, IAdminBadges } from '@/types/admin/admin-badge.type';
import { IApiResponse } from '@/types/shared';
import { ADMIN_BADGE_QUERY_KEYS, AdminBadgeApi } from '../admin-badge.api';

const BADGE_FIELD: Record<AdminBadgeType, keyof IAdminBadges> = {
  SUBMISSIONS: 'submissions',
  RESOURCE_REPORTS: 'resourceReports',
  USERS: 'users',
};

export function useMarkAdminBadgeRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: AdminBadgeType) => AdminBadgeApi.markAdminBadgeRead(type),
    // Hide the dot right away instead of waiting for the server round trip
    onMutate: (type) => {
      queryClient.setQueryData<IApiResponse<IAdminBadges>>(ADMIN_BADGE_QUERY_KEYS.all, (old) =>
        old?.result ? { ...old, result: { ...old.result, [BADGE_FIELD[type]]: false } } : old,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_BADGE_QUERY_KEYS.all });
    },
  });
}
