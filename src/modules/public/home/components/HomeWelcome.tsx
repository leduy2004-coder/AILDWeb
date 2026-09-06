'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { AuthActionTypes } from '@/types/shared';

import { IconSparkles } from '@tabler/icons-react';

interface HomeWelcomeProps {
  lastEvaluationDate?: string | null;
  isEvaluated?: boolean;
}

export const HomeWelcome: React.FC<HomeWelcomeProps> = ({ lastEvaluationDate, isEvaluated }) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Học viên');

  useEffect(() => {
    const userInfoStr = getLocalStorageItem<string>(AuthActionTypes.USER_INFO);
    if (userInfoStr) {
      try {
        const user = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
        const name = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Học viên';
        setUserName(name);
      } catch (e) {
        // Fallback default
      }
    }
  }, []);

  const formattedDate = lastEvaluationDate
    ? new Date(lastEvaluationDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : t('home.noEvaluationYet', 'Chưa có bài đánh giá nào');

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
          {t('home.lastEvaluation', 'Đánh giá lần cuối')}: {formattedDate}
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<IconSparkles size={20} />}
        onClick={() => router.push('/skill-tree')}
        sx={{
          background: 'linear-gradient(135deg, #112c66ff 0%, #1D4ED8 100%)',
          color: '#ffffff',
          px: 3,
          py: 1.5,
          fontWeight: 700,
          borderRadius: '10px',
          textTransform: 'none',
          fontSize: '15px',
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.45)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {t('home.startNewEvaluation', 'Bắt đầu bài đánh giá mới')}
      </Button>
    </Box>
  );
};
