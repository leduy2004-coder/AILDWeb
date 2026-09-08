import { useQuery } from '@tanstack/react-query';
import { SystemSettingApi } from '../system-setting.api';

export function useSystemSettings() {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: () => SystemSettingApi.getSystemSettings(),
  });
}
