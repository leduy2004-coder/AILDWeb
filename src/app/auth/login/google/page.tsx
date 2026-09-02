'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { loginGoogle } from '@/apis/auth';
import { setLocalStorageItems } from '@/modules/shared/utils';
import { PATH_NAME } from '@/modules/shared/constants';
import { AuthActionTypes } from '@/types/shared/auth.type';
import { showErrorToast } from '@/modules/shared/components/toasts/ToastHelper';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const processed = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code && !processed.current) {
      processed.current = true;
      handleGoogleLogin(code);
    } else if (!code && !processed.current) {
      router.push('/auth/login');
    }
  }, [searchParams, router]);

  const handleGoogleLogin = async (code: string) => {
    try {
      const response = await loginGoogle(code);
      
      if (response && response.result) {
        const user = response.result.user;

        const redirectPath = PATH_NAME.STUDENT;

        setLocalStorageItems({
          [AuthActionTypes.ACCESS_TOKEN]: response.result.access_token,
          [AuthActionTypes.USER_INFO]: JSON.stringify(user),
          loginSuccessMessage: JSON.stringify({
            title: t('login.success.title'),
            message: t('login.success.message'),
          }),
        });
        window.location.replace(redirectPath);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      showErrorToast(t('login.failed.title'), t('login.failed.message'));
      router.push('/auth/login');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        bgcolor: 'background.default'
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        {t('login.processingGoogle', 'Đang xử lý đăng nhập Google...')}
      </Typography>
    </Box>
  );
}
