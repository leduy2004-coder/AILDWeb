import http from '@/lib/http';
import { IApiResponse } from '@/types/shared';
import { API_PREFIX } from '@/apis/constants/api.constant';
import { ISystemSetting, ISystemSettingUpdateRequest } from '@/types/admin/system-setting.type';

export async function getSystemSettings(): Promise<IApiResponse<ISystemSetting[]>> {
  const { payload } = await http.get<IApiResponse<ISystemSetting[]>>(
    `${API_PREFIX.AILD}/admin/system-settings`
  );
  return payload;
}

export async function updateSystemSetting(
  key: string,
  data: ISystemSettingUpdateRequest
): Promise<IApiResponse<ISystemSetting>> {
  const { payload } = await http.put<IApiResponse<ISystemSetting>>(
    `${API_PREFIX.AILD}/admin/system-settings/${key}`,
    data
  );
  return payload;
}

export const SystemSettingApi = {
  getSystemSettings,
  updateSystemSetting,
};
