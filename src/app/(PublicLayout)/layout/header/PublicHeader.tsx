'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
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
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Logo margin="0" />

        {/* Links & Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box 
            component={Link} 
            href="/search"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'text.secondary',
              cursor: 'pointer',
              gap: 0.5,
              '&:hover': {
                color: 'primary.main',
              },
              '& .search-text': {
                maxWidth: 0,
                opacity: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
              },
              '&:hover .search-text': {
                maxWidth: 150,
                opacity: 1,
              }
            }}
          >
            <IconSearch size={22} stroke={2} />
            <Typography 
              className="search-text"
              variant="body1" 
              fontWeight={600}
            >
              {t('header.findTutor', 'Tìm Gia sư')}
            </Typography>
          </Box>

          <Language />

          {isLoggedIn ? (
            <Profile />
          ) : (
            <>
              <Button 
                variant="text" 
                color="inherit" 
                sx={{ textTransform: 'none', fontWeight: 600 }}
                onClick={() => router.push('/auth/login')}
              >
                {t('header.login', 'Đăng nhập')}
              </Button>

              <Button 
                variant="contained" 
                color="primary" 
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
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
