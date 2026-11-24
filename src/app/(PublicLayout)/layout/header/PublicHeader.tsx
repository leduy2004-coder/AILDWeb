'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import Language from '@/app/(DashboardLayout)/layout/vertical/header/Language';
import Profile from '@/app/(DashboardLayout)/layout/vertical/header/Profile';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import { AuthActionTypes } from '@/types/shared';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { isAdminPortal } from '@/modules/shared/utils/portal.util';

// The portal is fixed by the hostname, so there is nothing to subscribe to
const subscribeNever = () => () => {};

export const PublicHeader: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Known only in the browser; null on the server so the student-only sign-up button never flashes on the admin portal
  const adminPortal = useSyncExternalStore(subscribeNever, isAdminPortal, () => null);

  useEffect(() => {
    // Token only: a leftover USER_INFO from an older logout must not show the profile menu
    const token = getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN);
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', py: { xs: 1, md: 2 } }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Logo margin="0" href="/home" />

        {/* Links & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 3 } }}>
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

              {/* Sign-up is for students only: the admin portal only offers sign-in */}
              {adminPortal === false && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: { xs: '0.85rem', md: '1rem' }, px: { xs: 1.5, md: 2 } }}
                  onClick={() => router.push('/auth/register')}
                >
                  {t('header.register', 'Đăng ký')}
                </Button>
              )}
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};
