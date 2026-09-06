import http from '@/lib/http';
import { IOverviewResponse } from '@/types/admin/overview.type';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';

export async function getOverview(): Promise<IApiResponse<IOverviewResponse>> {
  const { payload } = await http.get<IApiResponse<IOverviewResponse>>(
    `${API_PREFIX.AILD_ADMIN}/overview`
  );
  return payload;
}

export const OverviewApi = {
  getOverview,
};


