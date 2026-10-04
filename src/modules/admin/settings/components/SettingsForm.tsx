import React, { useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSettingsSchema, SettingsFormValues } from '../schema/settings.schema';
import { SETTING_KEYS } from '../constants/settings.constant';

interface SettingsFormProps {
  initialValues: SettingsFormValues;
  isSaving: boolean;
  onSave: (values: SettingsFormValues) => void;
}

export default function SettingsForm({ initialValues, isSaving, onSave }: SettingsFormProps) {
  const { t } = useTranslation();
  const schema = getSettingsSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSave)} display="flex" flexDirection="column" gap={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1}>
            {t('admin_settings.title', 'Cài đặt Hệ thống')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('admin_settings.subtitle', 'Quản lý các cấu hình cốt lõi của hệ thống, bao gồm đánh giá AI và trọng số điểm.')}
          </Typography>
        </Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<IconDeviceFloppy size={20} />}
          disabled={isSaving}
        >
          {isSaving ? t('admin_settings.saving', 'Đang lưu...') : t('admin_settings.save', 'Lưu cài đặt')}
        </Button>
      </Box>

      {/* Test Config Group */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '1px', overflow: 'hidden' }}>
        <Box bgcolor="#F8FAFC" p={2} borderBottom="1px solid #E2E8F0">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {t('admin_settings.group.test_config', 'Cấu hình chung Bài thi')}
          </Typography>
        </Box>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={SETTING_KEYS.ASSESSMENT_QUESTION_COUNT}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    label={t('admin_settings.fields.question_count.label', 'Tổng số câu hỏi')}
                    error={!!errors[SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]}
                    helperText={errors[SETTING_KEYS.ASSESSMENT_QUESTION_COUNT]?.message}
                    type="number" InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={SETTING_KEYS.ASSESSMENT_DURATION_MINUTES}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    label={t('admin_settings.fields.duration_minutes.label', 'Thời gian làm bài (Phút)')}
                    error={!!errors[SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]}
                    helperText={errors[SETTING_KEYS.ASSESSMENT_DURATION_MINUTES]?.message}
                    type="number" InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* AI Assessment Group */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '1px', overflow: 'hidden' }}>
        <Box bgcolor="#F8FAFC" p={2} borderBottom="1px solid #E2E8F0">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {t('admin_settings.group.ai_assessment', 'Cấu hình Phỏng vấn AI')}
          </Typography>
        </Box>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={SETTING_KEYS.CHAT_MAX_TURNS}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    label={t('admin_settings.fields.chat_max_turns.label', 'Số lượt hỏi tối đa (AI Chat)')}
                    error={!!errors[SETTING_KEYS.CHAT_MAX_TURNS]}
                    helperText={errors[SETTING_KEYS.CHAT_MAX_TURNS]?.message}
                    type="number" InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name={SETTING_KEYS.CHAT_SYSTEM_PROMPT}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    multiline
                    spellCheck={false}
                    minRows={4} InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                    label={t('admin_settings.fields.chat_system_prompt.label', 'Prompt Hệ thống AI (System Prompt)')}
                    error={!!errors[SETTING_KEYS.CHAT_SYSTEM_PROMPT]}
                    helperText={errors[SETTING_KEYS.CHAT_SYSTEM_PROMPT]?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Scoring Group */}
      <Paper elevation={0} sx={{ border: '1px solid #E2E8F0', borderRadius: '1px', overflow: 'hidden' }}>
        <Box bgcolor="#F8FAFC" p={2} borderBottom="1px solid #E2E8F0">
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {t('admin_settings.group.scoring', 'Cấu hình Điểm số')}
          </Typography>
        </Box>
        <Box p={3}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={SETTING_KEYS.MCQ_WEIGHT}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    label={t('admin_settings.fields.mcq_weight.label', 'Trọng số phần Trắc nghiệm (VD: 0.6 = 60%)')}
                    error={!!errors[SETTING_KEYS.MCQ_WEIGHT]}
                    helperText={errors[SETTING_KEYS.MCQ_WEIGHT]?.message}
                    type="number" InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name={SETTING_KEYS.INTERVIEW_WEIGHT}
                control={control}
                render={({ field }) => (
                  <TextField required
                    {...field}
                    fullWidth
                    label={t('admin_settings.fields.interview_weight.label', 'Trọng số phần Phỏng vấn (VD: 0.4 = 40%)')}
                    error={!!errors[SETTING_KEYS.INTERVIEW_WEIGHT]}
                    helperText={errors[SETTING_KEYS.INTERVIEW_WEIGHT]?.message}
                    type="number" InputLabelProps={{ sx: { fontSize: '1.05rem', fontWeight: 600, '& .MuiFormLabel-asterisk': { color: 'error.main' } } }}
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}


