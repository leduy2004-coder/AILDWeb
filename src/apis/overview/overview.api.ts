import http from '@/lib/http';
import {
  IActivityResponse,
  IAttentionResponse,
  IDomainDetail,
  IImprovementStudent,
  ILevelDetail,
  IOverviewResponse,
  IReviewSubmission,
} from '@/types/admin/overview.type';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';

export async function getOverview(): Promise<IApiResponse<IOverviewResponse>> {
  const { payload } = await http.get<IApiResponse<IOverviewResponse>>(
    `${API_PREFIX.AILD_ADMIN}/overview`
  );
  return payload;
}

export async function getDomainDetail(domainId: number): Promise<IApiResponse<IDomainDetail>> {
  const { payload } = await http.get<IApiResponse<IDomainDetail>>(
    `${API_PREFIX.AILD_ADMIN}/overview/domains/${domainId}`
  );
  return payload;
}

export async function getLevelDetail(levelId: number): Promise<IApiResponse<ILevelDetail>> {
  const { payload } = await http.get<IApiResponse<ILevelDetail>>(
    `${API_PREFIX.AILD_ADMIN}/overview/levels/${levelId}`
  );
  return payload;
}

/** @param month 1-12 for that month by day; null for the whole year by month */
export async function getActivity(year: number, month: number | null): Promise<IApiResponse<IActivityResponse>> {
  const query = new URLSearchParams({ year: year.toString() });
  if (month) query.append('month', month.toString());
  const { payload } = await http.get<IApiResponse<IActivityResponse>>(
    `${API_PREFIX.AILD_ADMIN}/overview/activity?${query.toString()}`
  );
  return payload;
}

/** Assessments completed in one bar of the activity chart: a day (month + day), a month, or the whole year. */
export async function getActivitySubmissions(
  year: number,
  month: number | null,
  day: number | null
): Promise<IApiResponse<IReviewSubmission[]>> {
  const query = new URLSearchParams({ year: year.toString() });
  if (month) query.append('month', month.toString());
  if (day) query.append('day', day.toString());
  const { payload } = await http.get<IApiResponse<IReviewSubmission[]>>(
    `${API_PREFIX.AILD_ADMIN}/overview/activity/submissions?${query.toString()}`
  );
  return payload;
}

export async function getAttention(): Promise<IApiResponse<IAttentionResponse>> {
  const { payload } = await http.get<IApiResponse<IAttentionResponse>>(
    `${API_PREFIX.AILD_ADMIN}/overview/attention`
  );
  return payload;
}

export async function getImprovementList(): Promise<IApiResponse<IImprovementStudent[]>> {
  const { payload } = await http.get<IApiResponse<IImprovementStudent[]>>(
    `${API_PREFIX.AILD_ADMIN}/overview/improvement`
  );
  return payload;
}

export const OverviewApi = {
  getOverview,
  getDomainDetail,
  getLevelDetail,
  getActivity,
  getActivitySubmissions,
  getAttention,
  getImprovementList,
};


