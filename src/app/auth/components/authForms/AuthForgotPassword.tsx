'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useForgotPassword } from '@/apis/auth';
import { showErrorToast, showSuccessToast } from '@/modules/shared/components/toasts/ToastHelper';
import { forgotPasswordSchema, ForgotPasswordSchema } from '../../schemas/password-recovery.schema';
import {
  AUTH_PATH,
  getAuthErrorKey,
  RESEND_COOLDOWN_SECONDS,
  RESET_LINK_EXPIRE_MINUTES,
} from '../../constants/auth-flow.constant';

const buttonSx = { py: 1.5, borderRadius: '25px', textTransform: 'none', fontSize: '16px', fontWeight: 600 } as const;

/** Asks for the account email and mails a link to the reset-password page */
export default function AuthForgotPassword() {
  const { t } = useTranslation();
  const forgotMutation = useForgotPassword();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const { control, handleSubmit } = useForm<ForgotPasswordSchema>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendLink = (email: string, isResend: boolean) => {
    forgotMutation.mutate(email, {
      onSuccess: () => {
        setSentTo(email);
        setCooldown(RESEND_COOLDOWN_SECONDS);
        if (isResend) showSuccessToast(t('authFlow.common.successTitle'), t('authFlow.forgotPassword.resent'));
      },
      onError: (error) => {
        showErrorToast(t('authFlow.common.errorTitle'), t(getAuthErrorKey(error)));
      },
    });
  };

  const backToLogin = (
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
  );

  if (sentTo) {
    return (
      <Box textAlign="center">
        <MarkEmailReadOutlinedIcon color="primary" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('authFlow.forgotPassword.sentTitle')}
        </Typography>
        <Typography color="text.secondary" mb={3} sx={{ wordBreak: 'break-word' }}>
          {t('authFlow.forgotPassword.sentMessage', { email: sentTo, minutes: RESET_LINK_EXPIRE_MINUTES })}
        </Typography>
        <LoadingButton
          variant="outlined"
          fullWidth
          loading={forgotMutation.isPending}
          disabled={cooldown > 0}
          onClick={() => sendLink(sentTo, true)}
          sx={buttonSx}
        >
          {cooldown > 0
            ? t('authFlow.verifyOtp.resendIn', { seconds: cooldown })
            : t('authFlow.forgotPassword.resend')}
        </LoadingButton>
        {backToLogin}
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} mb={1} textAlign="center" sx={{ fontSize: { xs: '24px', sm: '28px' } }}>
        {t('authFlow.forgotPassword.title')}
      </Typography>
      <Typography color="text.secondary" textAlign="center" mb={3}>
        {t('authFlow.forgotPassword.subtitle')}
      </Typography>

      <form onSubmit={handleSubmit((data) => sendLink(data.email.trim(), false))}>
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={14} fontWeight={600} mb={1}>
              {t('login.email.title')}
            </Typography>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type="email"
                  autoFocus
                  placeholder={t('login.email.placeholder')}
                  error={!!error}
                  helperText={error?.message ? t(error.message) : ''}
                />
              )}
            />
          </Box>

          <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={forgotMutation.isPending} sx={buttonSx}>
            {t('authFlow.forgotPassword.submit')}
          </LoadingButton>
        </Stack>
      </form>

      {backToLogin}
    </Box>
  );
}
