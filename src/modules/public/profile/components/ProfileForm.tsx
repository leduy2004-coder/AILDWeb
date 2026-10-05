'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Paper,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { IconUser } from '@tabler/icons-react';
import { getProfileSchema, ProfileFormValues } from '../schema/profile.schema';

interface ProfileFormProps {
  email?: string;
  initialValues: ProfileFormValues;
  isSaving: boolean;
  onSave: (values: ProfileFormValues) => void;
}

export default function ProfileForm({ email, initialValues, isSaving, onSave }: ProfileFormProps) {
  const { t } = useTranslation();
  const schema = getProfileSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      {/* Header */}
      <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={{ xs: 1.5, md: 2 }} mb={4} pb={2} borderBottom="1px solid #E2E8F0">
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            flexShrink: 0,
          }}
        >
          <IconUser size={32} />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('profile.subtitle', 'Vui lòng cập nhật thông tin cá nhân để hệ thống có thể tùy chỉnh bài đánh giá phù hợp với bạn.')}
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSave)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField required
                  {...field}
                  label={t('profile.fields.name.label', 'Họ và tên')}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField required
                  {...field}
                  label={t('profile.fields.age.label', 'Độ tuổi')}
                  type="number"
                  fullWidth
                  error={!!errors.age}
                  helperText={
                    errors.age?.message ||
                    <Typography component="span" variant="caption" fontStyle="italic" color="primary.main">{t('profile.fields.age.description', 'Giúp hệ thống cá nhân hóa câu hỏi')}</Typography>
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="major"
              control={control}
              render={({ field }) => (
                <TextField required
                  {...field}
                  label={t('profile.fields.major.label', 'Ngành nghề / Lĩnh vực')}
                  fullWidth
                  error={!!errors.major}
                  helperText={
                    errors.major?.message ||
                    <Typography component="span" variant="caption" fontStyle="italic" color="primary.main">{t('profile.fields.major.description', 'Ví dụ: IT, Kế toán, Sinh viên...')}</Typography>
                  }
                />
              )}
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" size="large" disabled={isSaving}>
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('profile.save', 'Lưu thông tin')
            )}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}


