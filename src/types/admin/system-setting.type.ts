export interface ISystemSetting {
  settingKey: string;
  settingValue: string;
  description: string;
}

export interface ISystemSettingUpdateRequest {
  settingValue: string;
}
