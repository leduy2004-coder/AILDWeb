'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from '@/store/store';

export const HomeWelcome = () => {
  const { t } = useTranslation();
  // TODO: Use actual user name from auth state if available
  // const user = useSelector((state: AppState) => state.auth.user);
  // const userName = user?.name || 'Alex Johnson';
  const userName = 'Alex Johnson'; // Placeholder for now

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography variant="h3" fontWeight={700} color="text.primary" gutterBottom>
          {t('home.welcome', 'Chào mừng trở lại')}, {userName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('home.lastEvaluation', 'Đánh giá lần cuối')}: {t('home.datePlaceholder', 'Ngày 12 tháng 10, 2023')}
        </Typography>
      </Box>
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#1E3A8A', // Dark blue from the image
          color: '#fff',
          px: 3,
          py: 1.5,
          fontWeight: 600,
          borderRadius: '8px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#172554',
          },
        }}
      >
        {t('home.startNewEvaluation', 'Bắt đầu bài đánh giá mới')}
      </Button>
    </Box>
  );
};
