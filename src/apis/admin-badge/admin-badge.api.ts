import http from '@/lib/http';
import envConfig from '@/lib/config';
import { AuthActionTypes } from '@/types/shared';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import { AdminBadgeType, IAdminBadges } from '@/types/admin/admin-badge.type';

export const ADMIN_BADGE_QUERY_KEYS = {
  all: ['admin-badges'] as const,
};

export async function getAdminBadges(): Promise<IApiResponse<IAdminBadges>> {
  const { payload } = await http.get<IApiResponse<IAdminBadges>>(`${API_PREFIX.AILD_ADMIN}/badges`);
  return payload;
}

/** Everything of this type becomes read for every admin */
export async function markAdminBadgeRead(type: AdminBadgeType): Promise<IApiResponse<boolean>> {
  const { payload } = await http.post<IApiResponse<boolean>>(`${API_PREFIX.AILD_ADMIN}/badges/${type}/read`, {});
  return payload;
}

/**
 * Opens the Server-Sent Events stream of badge changes. Uses fetch rather than EventSource because
 * EventSource cannot send the Authorization header the gateway requires.
 */
export async function openAdminBadgeStream(signal: AbortSignal): Promise<Response> {
  const token = localStorage.getItem(AuthActionTypes.ACCESS_TOKEN);
  return fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}${API_PREFIX.AILD_ADMIN}/badges/stream`, {
    headers: {
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    cache: 'no-store',
    signal,
  });
}

export const AdminBadgeApi = {
  getAdminBadges,
  markAdminBadgeRead,
  openAdminBadgeStream,
};
