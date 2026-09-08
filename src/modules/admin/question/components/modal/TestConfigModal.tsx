'use client';

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { useSystemSettings, useUpdateSystemSetting } from '@/apis/system-setting/hook';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';
import { IconSettings } from '@tabler/icons-react';

interface TestConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export const TestConfigModal: React.FC<TestConfigModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation('translation');
  const queryClient = useQueryClient();

  const configSchema = z.object({
    questionCount: z
      .number({ message: t('admin_question.config.validation.invalidType', 'Vui lòng nhập số') })
      .min(5, t('admin_question.config.validation.minQuestions', 'Số câu hỏi tối thiểu là 5'))
      .max(50, t('admin_question.config.validation.maxQuestions', 'Số câu hỏi tối đa là 50')),
    durationMinutes: z
      .number({ message: t('admin_question.config.validation.invalidType', 'Vui lòng nhập số') })
      .min(5, t('admin_question.config.validation.minDuration', 'Thời gian tối thiểu là 5 phút'))
      .max(180, t('admin_question.config.validation.maxDuration', 'Thời gian tối đa là 180 phút')),
  });

  type ConfigFormValues = z.infer<typeof configSchema>;

  const { data: settingsResponse, isLoading } = useSystemSettings();

  const updateMutation = useUpdateSystemSetting();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      questionCount: 15,
      durationMinutes: 15,
    },
  });

  useEffect(() => {
    if (settingsResponse?.result) {
      const qCount = settingsResponse.result.find((s) => s.settingKey === 'ASSESSMENT_QUESTION_COUNT');
      const duration = settingsResponse.result.find((s) => s.settingKey === 'ASSESSMENT_DURATION_MINUTES');
      
      reset({
        questionCount: qCount ? parseInt(qCount.settingValue) : 15,
        durationMinutes: duration ? parseInt(duration.settingValue) : 15,
      });
    }
  }, [settingsResponse, reset]);

  const onSubmit = (data: ConfigFormValues) => {
    updateMutation.mutate(
      { key: 'ASSESSMENT_QUESTION_COUNT', data: { settingValue: data.questionCount.toString() } },
      {
        onSuccess: () => {
          updateMutation.mutate(
            { key: 'ASSESSMENT_DURATION_MINUTES', data: { settingValue: data.durationMinutes.toString() } },
            {
              onSuccess: () => {
                toast.success(t('admin_question.config.success', 'Cập nhật cấu hình bài thi thành công'));
                onClose();
              },
              onError: () => {
                toast.error(t('admin_question.config.error', 'Có lỗi xảy ra khi cập nhật cấu hình'));
              }
            }
          );
        },
        onError: () => {
          toast.error(t('admin_question.config.error', 'Có lỗi xảy ra khi cập nhật cấu hình'));
        }
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <IconSettings size={24} />
          {t('admin_question.config.title', 'Cấu hình Bài thi Đánh giá')}
        </Box>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={3}>
              <Typography variant="body2" color="text.secondary">
                {t('admin_question.config.subtitle', 'Cấu hình này sẽ áp dụng cho tất cả bài thi Đánh giá năng lực của sinh viên.')}
              </Typography>
              
              <Controller
                name="questionCount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    label={t('admin_question.config.questionCount', 'Tổng số câu hỏi')}
                    type="number"
                    fullWidth
                    error={!!errors.questionCount}
                    helperText={errors.questionCount?.message}
                  />
                )}
              />

              <Controller
                name="durationMinutes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                    label={t('admin_question.config.duration', 'Thời gian làm bài (Phút)')}
                    type="number"
                    fullWidth
                    error={!!errors.durationMinutes}
                    helperText={errors.durationMinutes?.message}
                  />
                )}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={updateMutation.isPending}>
            {t('common.cancel', 'Hủy')}
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading || updateMutation.isPending}>
            {updateMutation.isPending ? <CircularProgress size={24} color="inherit" /> : t('common.save', 'Lưu thay đổi')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
