import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared/api.type';
import { IResource, IResourceRequest, IResourceLike, IResourceReport } from '@/types/admin/resource.type';
import { API_PREFIX } from '@/apis/constants/api.constant';

export const RESOURCE_QUERY_KEYS = {
  all: ['resources'] as const,
  list: (filter: any) => ['resources', filter] as const,
  detail: (id: number) => ['resources', id] as const,
};

export async function getResources(filter: { domainId?: number | null; targetLevelId?: number | null; keyword?: string; page?: number; size?: number }): Promise<IApiResponse<IPageResponse<IResource>>> {
  const queryParams = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  const { payload } = await http.get<IApiResponse<IPageResponse<IResource>>>(
    `${API_PREFIX.AILD_ADMIN}/resources?${queryParams.toString()}`
  );
  return payload;
}

export async function getResourceById(id: number): Promise<IApiResponse<IResource>> {
  const { payload } = await http.get<IApiResponse<IResource>>(`${API_PREFIX.AILD_ADMIN}/resources/${id}`);
  return payload;
}

export async function createResource(data: IResourceRequest): Promise<IApiResponse<IResource>> {
  const { payload } = await http.post<IApiResponse<IResource>>(`${API_PREFIX.AILD_ADMIN}/resources`, data);
  return payload;
}

export async function updateResource(id: number, data: IResourceRequest): Promise<IApiResponse<IResource>> {
  const { payload } = await http.put<IApiResponse<IResource>>(`${API_PREFIX.AILD_ADMIN}/resources/${id}`, data);
  return payload;
}

export async function deleteResource(id: number): Promise<IApiResponse<any>> {
  const { payload } = await http.delete<IApiResponse<any>>(`${API_PREFIX.AILD_ADMIN}/resources/${id}`);
  return payload;
}

export async function deleteResources(ids: number[]): Promise<IApiResponse<any>> {
  const { payload } = await http.delete<IApiResponse<any>>(`${API_PREFIX.AILD_ADMIN}/resources/bulk`, ids);
  return payload;
}

export async function getResourceLikes(id: number): Promise<IApiResponse<IResourceLike[]>> {
  const { payload } = await http.get<IApiResponse<IResourceLike[]>>(`${API_PREFIX.AILD_ADMIN}/resources/${id}/likes`);
  return payload;
}

export async function getResourceReports(id: number): Promise<IApiResponse<IResourceReport[]>> {
  const { payload } = await http.get<IApiResponse<IResourceReport[]>>(`${API_PREFIX.AILD_ADMIN}/resources/${id}/reports`);
  return payload;
}

export async function deleteResourceReport(reportId: number): Promise<IApiResponse<any>> {
  const { payload } = await http.delete<IApiResponse<any>>(`${API_PREFIX.AILD_ADMIN}/resources/reports/${reportId}`);
  return payload;
}

export const resourceApi = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  deleteResources,
  getResourceLikes,
  getResourceReports,
  deleteResourceReport,
};
