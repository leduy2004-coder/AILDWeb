import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SystemSettingApi } from '../system-setting.api';
import { ISystemSettingUpdateRequest } from '@/types/admin/system-setting.type';

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: ISystemSettingUpdateRequest }) => 
      SystemSettingApi.updateSystemSetting(key, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
  });
}
