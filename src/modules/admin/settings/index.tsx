'use client';

import React, { useMemo, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useQueryClient } from '@tanstack/react-query';

import { PageContainer } from '@/modules/shared/components/container/PageContainer';
import { useSystemSettings } from '@/apis/system-setting/hook/useSystemSettings';
import { SystemSettingApi } from '@/apis/system-setting/system-setting.api';
import SettingsForm from './components/SettingsForm';
import { SettingsFormValues } from './schema/settings.schema';
import { SETTING_KEYS } from './constants/settings.constant';

export default function AdminSettingsModule() {
  const { t } = useTranslation();
  const { data: settingsData, isLoading, error } = useSystemSettings();
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const initialValues = useMemo<SettingsFormValues>(() => {
    if (!settingsData?.result) {
      return {
        [SETTING_KEYS.CHAT_MAX_TURNS]: 4,
        [SETTING_KEYS.CHAT_SYSTEM_PROMPT]: 'Bạn là giám khảo...',
        [SETTING_KEYS.MCQ_WEIGHT]: 0.6,
        [SETTING_KEYS.INTERVIEW_WEIGHT]: 0.4,
        [SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]: 15,
        [SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]: 15,
      };
    }

    const data: Record<string, string> = {};
    settingsData.result.forEach((setting) => {
      data[setting.settingKey] = setting.settingValue;
    });

    return {
      [SETTING_KEYS.CHAT_MAX_TURNS]: Number(data[SETTING_KEYS.CHAT_MAX_TURNS]) || 4,
      [SETTING_KEYS.CHAT_SYSTEM_PROMPT]: data[SETTING_KEYS.CHAT_SYSTEM_PROMPT] || 'Bạn là giám khảo...',
      [SETTING_KEYS.MCQ_WEIGHT]: Number(data[SETTING_KEYS.MCQ_WEIGHT]) || 0.6,
      [SETTING_KEYS.INTERVIEW_WEIGHT]: Number(data[SETTING_KEYS.INTERVIEW_WEIGHT]) || 0.4,
      [SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]: Number(data[SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]) || 15,
      [SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]: Number(data[SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]) || 15,
    };
  }, [settingsData]);

  const handleSave = async (values: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const promises = Object.entries(values).map(([key, value]) => {
        return SystemSettingApi.updateSystemSetting(key, { settingValue: String(value) });
      });
      await Promise.all(promises);
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success(t('admin_settings.success', 'Đã lưu cài đặt hệ thống thành công!'));
    } catch (err) {
      toast.error(t('admin_settings.error', 'Lỗi khi lưu cài đặt.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <Typography color="error">{t('admin_settings.errorFetch', 'Lỗi khi tải cài đặt.')}</Typography>
      </Box>
    );
  }

  return (
    <PageContainer title={t('admin_settings.title', 'Cài đặt Hệ thống')} description="Settings">
      <SettingsForm
        initialValues={initialValues}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
