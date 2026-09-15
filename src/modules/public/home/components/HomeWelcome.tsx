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
  finalScore?: number | null;
}

export const HomeWelcome: React.FC<HomeWelcomeProps> = ({ lastEvaluationDate, isEvaluated, finalScore }) => {
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

  const handleStartEvaluation = () => {
    const token = getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN);
    if (!token) {
      router.push('/auth/login');
    } else {
      router.push('/assessment');
    }
  };

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
        
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="body1" color="text.secondary">
            {t('home.lastEvaluation', 'Đánh giá lần cuối')}: {formattedDate}
          </Typography>
          
          {isEvaluated && finalScore !== undefined && finalScore !== null && (
            <Box
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Typography variant="subtitle2" fontWeight={700}>
                Điểm tổng kết:
              </Typography>
              <Typography variant="subtitle1" fontWeight={800}>
                {finalScore.toFixed(1)}/10
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Button
        variant="contained"
        startIcon={<IconSparkles size={20} />}
        onClick={handleStartEvaluation}
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
        {isEvaluated
          ? t('home.startNewEvaluation', 'Bắt đầu bài đánh giá mới')
          : t('home.startEvaluation', 'Bắt đầu đánh giá')}
      </Button>
    </Box>
  );
};
