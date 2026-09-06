'use client';

import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconSparkles, IconBrain } from '@tabler/icons-react';

interface HomeAiFeedbackProps {
  aiFeedback?: string | null;
  isEvaluated?: boolean;
}

export const HomeAiFeedback: React.FC<HomeAiFeedbackProps> = ({
  aiFeedback,
  isEvaluated = false,
}) => {
  const { t } = useTranslation();

  const feedbackText =
    aiFeedback ||
    t(
      'home.aiFeedback.defaultDesc',
      'Bạn chưa thực hiện bài đánh giá nào. Hãy bắt đầu bài đánh giá mới để AI phân tích thế mạnh và đưa ra nhận xét, gợi ý lộ trình học tập cá nhân hóa dành riêng cho bạn!'
    );

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: '16px',
        border: '1.5px solid',
        borderColor: '#C7D2FE',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative top accent line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #4F46E5 0%, #06B6D4 50%, #10B981 100%)',
        }}
      />

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            }}
          >
            <IconSparkles size={24} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1E1B4B" display="flex" alignItems="center" gap={1}>
              {t('home.aiFeedback.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('home.aiFeedback.subtitle', 'Phân tích tự động dựa trên kết quả đánh giá năng lực của bạn')}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<IconBrain size={14} color="#4F46E5" />}
          label={t('home.aiFeedback.tag', 'Gợi ý cá nhân hóa')}
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: '#EEF2FF',
            color: '#4338CA',
            border: '1px solid #C7D2FE',
            fontSize: '12px',
            height: '28px',
          }}
        />
      </Box>

      <Box
        sx={{
          p: 2.2,
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0E7FF',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#334155',
            lineHeight: 1.7,
            fontWeight: 500,
            fontSize: '14.5px',
          }}
        >
          {feedbackText}
        </Typography>
      </Box>
    </Paper>
  );
};
