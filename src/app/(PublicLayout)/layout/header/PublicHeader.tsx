'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import Language from '@/app/(DashboardLayout)/layout/vertical/header/Language';
import Profile from '@/app/(DashboardLayout)/layout/vertical/header/Profile';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import { AuthActionTypes } from '@/types/shared';
import { getLocalStorageItem } from '@/modules/shared/utils';

export const PublicHeader: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN);
    const userInfoStr = getLocalStorageItem<string>(AuthActionTypes.USER_INFO);
    if (token || userInfoStr) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', py: { xs: 1, md: 2 } }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Logo margin="0" />

        {/* Links & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 3 } }}>
          <Language />

          {isLoggedIn ? (
            <Profile />
          ) : (
            <>
              <Button 
                variant="text" 
                color="inherit" 
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.85rem', md: '1rem' }, px: { xs: 1, md: 2 } }}
                onClick={() => router.push('/auth/login')}
              >
                {t('header.login', 'Đăng nhập')}
              </Button>

              <Button 
                variant="contained" 
                color="primary" 
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: { xs: '0.85rem', md: '1rem' }, px: { xs: 1.5, md: 2 } }}
                onClick={() => router.push('/auth/register')}
              >
                {t('header.register', 'Đăng ký')}
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};
