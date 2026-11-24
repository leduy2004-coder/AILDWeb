'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useChangePassword } from '@/apis/auth';
import { getAuthErrorCode, getAuthErrorKey } from '@/app/auth/constants/auth-flow.constant';
import { showErrorToast, showSuccessToast } from '@/modules/shared/components/toasts/ToastHelper';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { AuthActionTypes } from '@/types/shared';
import ChangePasswordForm from './components/ChangePasswordForm';
import { ChangePasswordFormValues } from './schema/change-password.schema';

/** auth-service codes this page explains itself; the rest fall back to the shared auth messages */
const CHANGE_PASSWORD_ERROR_KEY: Record<number, string> = {
  1019: 'changePassword.errors.wrongCurrent',
  1020: 'changePassword.validation.sameAsCurrent',
};

// The token is read once on mount; a later login/logout reloads the page anyway
const subscribeNever = () => () => {};
const hasAccessToken = () => Boolean(getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN));

export default function ChangePasswordModule() {
  const { t } = useTranslation();
  const router = useRouter();
  // Null on the server (no localStorage there), then whether the browser holds a session
  const isLoggedIn = useSyncExternalStore(subscribeNever, hasAccessToken, () => null);
  const changeMutation = useChangePassword();

  useEffect(() => {
    if (isLoggedIn === false) router.push('/auth/login');
  }, [isLoggedIn, router]);

  const handleSave = async (values: ChangePasswordFormValues) => {
    try {
      await changeMutation.mutateAsync({ password: values.currentPassword, newPass: values.newPassword });
      showSuccessToast(t('authFlow.common.successTitle'), t('changePassword.success'));
      return true;
    } catch (error) {
      const code = getAuthErrorCode(error);
      const key = (code !== undefined && CHANGE_PASSWORD_ERROR_KEY[code]) || getAuthErrorKey(error);
      showErrorToast(t('authFlow.common.errorTitle'), t(key));
      return false;
    }
  };

  if (!isLoggedIn) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="sm" mx="auto" py={{ xs: 4, md: 6 }} px={{ xs: 2, md: 3 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        textAlign="center"
        color="primary.main"
        sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
      >
        {t('changePassword.title')}
      </Typography>

      <ChangePasswordForm isSaving={changeMutation.isPending} onSave={handleSave} />
    </Box>
  );
}
