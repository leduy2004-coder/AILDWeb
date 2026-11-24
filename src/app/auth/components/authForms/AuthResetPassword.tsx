'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useResetPassword, useValidateResetToken } from '@/apis/auth';
import { showErrorToast, showSuccessToast } from '@/modules/shared/components/toasts/ToastHelper';
import { resetPasswordSchema, ResetPasswordSchema } from '../../schemas/password-recovery.schema';
import { AUTH_PATH, getAuthErrorCode, getAuthErrorKey } from '../../constants/auth-flow.constant';

const RESET_TOKEN_INVALID_CODE = 1027;

/** Opened from the forgot-password email: sets a new password for the account the link belongs to */
export default function AuthResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const token = useSearchParams().get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [linkRejected, setLinkRejected] = useState(false);
  const validateQuery = useValidateResetToken(token);
  const resetMutation = useResetPassword();

  const { control, handleSubmit } = useForm<ResetPasswordSchema>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = (data: ResetPasswordSchema) => {
    if (!token) return;
    resetMutation.mutate(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          showSuccessToast(t('authFlow.common.successTitle'), t('authFlow.resetPassword.success'));
          router.push(AUTH_PATH.LOGIN);
        },
        onError: (error) => {
          if (getAuthErrorCode(error) === RESET_TOKEN_INVALID_CODE) setLinkRejected(true);
          showErrorToast(t('authFlow.common.errorTitle'), t(getAuthErrorKey(error)));
        },
      },
    );
  };

  if (token && validateQuery.isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
        <Typography color="text.secondary" mt={2}>
          {t('authFlow.resetPassword.checking')}
        </Typography>
      </Box>
    );
  }

  const isLinkUsable = Boolean(token) && validateQuery.data === true && !linkRejected;
  if (!isLinkUsable) {
    return (
      <Box textAlign="center">
        <LinkOffOutlinedIcon color="error" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('authFlow.resetPassword.invalidTitle')}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {t('authFlow.resetPassword.invalidMessage')}
        </Typography>
        <Button component={Link} href={AUTH_PATH.FORGOT_PASSWORD} variant="contained" sx={{ borderRadius: '25px', px: 4 }}>
          {t('authFlow.resetPassword.requestNewLink')}
        </Button>
      </Box>
    );
  }

  const passwordAdornment = (
    <InputAdornment position="end">
      <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} mb={1} textAlign="center" sx={{ fontSize: { xs: '24px', sm: '28px' } }}>
        {t('authFlow.resetPassword.title')}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mb={3}>
        {t('authFlow.resetPassword.subtitle')}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={14} fontWeight={600} mb={1}>
              {t('authFlow.resetPassword.newPassword')}
            </Typography>
            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  autoFocus
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('authFlow.resetPassword.newPasswordPlaceholder')}
                  error={!!error}
                  helperText={error?.message ? t(error.message) : ''}
                  InputProps={{ endAdornment: passwordAdornment }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography fontSize={14} fontWeight={600} mb={1}>
              {t('authFlow.resetPassword.confirmPassword')}
            </Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={t('authFlow.resetPassword.confirmPasswordPlaceholder')}
                  error={!!error}
                  helperText={error?.message ? t(error.message) : ''}
                />
              )}
            />
          </Box>

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={resetMutation.isPending}
            sx={{ py: 1.5, borderRadius: '25px', textTransform: 'none', fontSize: '16px', fontWeight: 600 }}
          >
            {t('authFlow.resetPassword.submit')}
          </LoadingButton>
        </Stack>
      </form>

      <Typography
        component={Link}
        href={AUTH_PATH.LOGIN}
        display="block"
        textAlign="center"
        mt={3}
        fontSize={14}
        fontWeight={500}
        sx={{ textDecoration: 'none', color: 'primary.main' }}
      >
        {t('authFlow.common.backToLogin')}
      </Typography>
    </Box>
  );
}
