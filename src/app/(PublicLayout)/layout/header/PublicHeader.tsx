'use client';

import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import logo from '@/assests/images/logo.png';
import Language from '@/app/(DashboardLayout)/layout/vertical/header/Language';

export const PublicHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();



  return (
    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', py: 2 }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box 
          sx={{ display: 'flex', alignItems: 'center', gap: 0, cursor: 'pointer' }}
          onClick={() => router.push('/home')}
        >
          <Box component="img" src={logo.src} alt="AILD Logo" sx={{ height: 50, borderRadius: '8px' }} />
          <Typography 
            variant="h5" 
            fontWeight={800} 
            sx={{ 
              color: '#1E3A8A', // Dark blue
              letterSpacing: '1px',
              fontFamily: '"Inter", "Outfit", sans-serif',
              ml: -2
            }}
          >
            AILD
          </Typography>
      </Box>

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
        </Box>
      </Container>
    </Box>
  );
};
