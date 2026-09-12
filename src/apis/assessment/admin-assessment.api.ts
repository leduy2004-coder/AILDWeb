import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import {
  IAdminAssessmentListDto,
  IAdminAssessmentDetailDto,
} from '@/types/admin/assessment.type';

export const ADMIN_ASSESSMENT_QUERY_KEYS = {
  all: ['admin-assessments'] as const,
  list: (page: number, limit: number, search?: string, status?: string) =>
    ['admin-assessments', page, limit, search, status] as const,
  detail: (id: number) => ['admin-assessments', id] as const,
};

const BASE_URL = `${API_PREFIX.AILD_ADMIN}/assessments`;

export async function getAssessments(
  page: number = 1,
  limit: number = 10,
  search?: string,
  status?: string
): Promise<IApiResponse<IPageResponse<IAdminAssessmentListDto>>> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) {
    queryParams.append('search', search);
  }
  if (status) {
    queryParams.append('status', status);
  }

  const { payload } = await http.get<IApiResponse<IPageResponse<IAdminAssessmentListDto>>>(
    `${BASE_URL}?${queryParams.toString()}`
  );
  return payload;
}

export async function getAssessmentDetail(id: number): Promise<IApiResponse<IAdminAssessmentDetailDto>> {
  const { payload } = await http.get<IApiResponse<IAdminAssessmentDetailDto>>(`${BASE_URL}/${id}`);
  return payload;
}

export async function deleteAssessments(ids: number[]): Promise<IApiResponse<void>> {
  const { payload } = await http.delete<IApiResponse<void>>(BASE_URL, ids);
  return payload;
}

export const AdminAssessmentApi = {
  getAssessments,
  getAssessmentDetail,
  deleteAssessments,
};
