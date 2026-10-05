import http from '@/lib/http';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import { IDomain, IDomainRequest, ILevel, ILevelRequest } from '@/types/admin/config.type';

export const CONFIG_QUERY_KEYS = {
  domains: ['config-domains'] as const,
  levels: ['config-levels'] as const,
};

// ===== Domains =====
export async function getDomains(): Promise<IApiResponse<IDomain[]>> {
  const { payload } = await http.get<IApiResponse<IDomain[]>>(`${API_PREFIX.AILD_ADMIN}/configs/domains`);
  return payload;
}

export async function createDomain(data: IDomainRequest): Promise<IApiResponse<IDomain>> {
  const { payload } = await http.post<IApiResponse<IDomain>>(`${API_PREFIX.AILD_ADMIN}/configs/domains`, data);
  return payload;
}

export async function deleteDomain(id: number): Promise<IApiResponse<void>> {
  const { payload } = await http.delete<IApiResponse<void>>(`${API_PREFIX.AILD_ADMIN}/configs/domains/${id}`);
  return payload;
}

// ===== Levels =====
export async function getLevels(): Promise<IApiResponse<ILevel[]>> {
  const { payload } = await http.get<IApiResponse<ILevel[]>>(`${API_PREFIX.AILD_ADMIN}/configs/levels`);
  return payload;
}

export async function createLevel(data: ILevelRequest): Promise<IApiResponse<ILevel>> {
  const { payload } = await http.post<IApiResponse<ILevel>>(`${API_PREFIX.AILD_ADMIN}/configs/levels`, data);
  return payload;
}

export async function deleteLevel(id: number): Promise<IApiResponse<void>> {
  const { payload } = await http.delete<IApiResponse<void>>(`${API_PREFIX.AILD_ADMIN}/configs/levels/${id}`);
  return payload;
}

export const ConfigApi = {
  getDomains,
  createDomain,
  deleteDomain,
  getLevels,
  createLevel,
  deleteLevel,
};
