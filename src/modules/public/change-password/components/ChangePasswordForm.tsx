'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, InputAdornment, Paper, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconLock } from '@tabler/icons-react';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import {
  CHANGE_PASSWORD_DEFAULT_VALUES,
  changePasswordSchema,
  ChangePasswordFormValues,
} from '../schema/change-password.schema';

interface ChangePasswordFormProps {
  isSaving: boolean;
  /** Resolves true when the password was changed, so the form can clear itself */
  onSave: (values: ChangePasswordFormValues) => Promise<boolean>;
}

type FieldName = keyof ChangePasswordFormValues;

const FIELDS: { name: FieldName; label: string; placeholder: string; autoComplete: string }[] = [
  {
    name: 'currentPassword',
    label: 'changePassword.currentPassword',
    placeholder: 'changePassword.currentPasswordPlaceholder',
    autoComplete: 'current-password',
  },
  {
    name: 'newPassword',
    label: 'changePassword.newPassword',
    placeholder: 'changePassword.newPasswordPlaceholder',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'changePassword.confirmPassword',
    placeholder: 'changePassword.confirmPasswordPlaceholder',
    autoComplete: 'new-password',
  },
];

export default function ChangePasswordForm({ isSaving, onSave }: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<Record<FieldName, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: CHANGE_PASSWORD_DEFAULT_VALUES,
  });

  const submit = async (values: ChangePasswordFormValues) => {
    if (await onSave(values)) reset(CHANGE_PASSWORD_DEFAULT_VALUES);
  };

  const toggleVisible = (name: FieldName) => setVisible((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: '12px', border: '1px solid #E2E8F0' }}>
      <Box display="flex" alignItems="center" gap={2} mb={4} pb={2} borderBottom="1px solid #E2E8F0">
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'primary.light',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <IconLock size={28} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t('changePassword.subtitle')}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(submit)}>
        <Stack spacing={2.5}>
          {FIELDS.map((item) => (
            <Box key={item.name}>
              <Typography fontSize={14} fontWeight={600} mb={1}>
                {t(item.label)}
              </Typography>
              <Controller
                name={item.name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type={visible[item.name] ? 'text' : 'password'}
                    autoComplete={item.autoComplete}
                    placeholder={t(item.placeholder)}
                    error={!!error}
                    helperText={error?.message ? t(error.message) : ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton edge="end" onClick={() => toggleVisible(item.name)}>
                            {visible[item.name] ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          ))}

          <Box display="flex" justifyContent="flex-end">
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSaving}
              sx={{ px: 4, py: 1.2, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              {t('changePassword.submit')}
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
