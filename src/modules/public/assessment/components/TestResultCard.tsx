'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, LinearProgress } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { IconArrowRight } from '@tabler/icons-react';
import chucmungImg from '@/assests/images/chucmung.png';
import { IAssessmentSummaryResponse } from '@/apis/assessment/assessment.api';

interface TestResultCardProps {
  summaryData: IAssessmentSummaryResponse | null;
}

const getDomainInfo = (
  codeOrName: string,
  originalName: string,
  t: (key: string, options?: any) => string
) => {
  const str = (codeOrName || '').toUpperCase();
  const nameStr = (originalName || '').toUpperCase();

  if (str.includes('HCM') || str === '1' || str.includes('DOMAIN_1') || nameStr.includes('CON NGƯỜI')) {
    return {
      code: 'HCM',
      label: t('assessment.domains.HCM', { defaultValue: 'Tư duy lấy con người làm trung tâm' }),
      color: '#4F46E5',
      bg: '#EEF2FF',
    };
  }
  if (str.includes('ETHIC') || str === '2' || str.includes('DOMAIN_2') || nameStr.includes('ĐẠO ĐỨC')) {
    return {
      code: 'ETHICS',
      label: t('assessment.domains.ETHICS', { defaultValue: 'Đạo đức AI' }),
      color: '#059669',
      bg: '#ECFDF5',
    };
  }
  if (str.includes('TECH') || str === '3' || str.includes('DOMAIN_3') || nameStr.includes('KỸ THUẬT')) {
    return {
      code: 'TECH',
      label: t('assessment.domains.TECH', { defaultValue: 'Kỹ thuật & Ứng dụng AI' }),
      color: '#0284C7',
      bg: '#F0F9FF',
    };
  }
  if (str.includes('DESIGN') || str === '4' || str.includes('DOMAIN_4') || nameStr.includes('THIẾT KẾ')) {
    return {
      code: 'DESIGN',
      label: t('assessment.domains.DESIGN', { defaultValue: 'Thiết kế Hệ thống AI' }),
      color: '#D97706',
      bg: '#FFFBEB',
    };
  }
  return {
    code: codeOrName,
    label: originalName || codeOrName,
    color: '#1E3A8A',
    bg: '#F8FAFC',
  };
};

export const TestResultCard: React.FC<TestResultCardProps> = ({ summaryData }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const domainScores = summaryData?.domainScores || [];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py={4}
      px={2}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 680,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: '24px',
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 50px rgba(30, 58, 138, 0.08)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Gradient Accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 50%, #F59E0B 100%)',
          }}
        />

        {/* Celebration Image */}
        <Box
          sx={{
            position: 'relative',
            width: 130,
            height: 130,
            mb: 2,
            filter: 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.2))',
            animation: 'bounce 2s infinite ease-in-out',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-8px)' },
            },
          }}
        >
          <Image
            src={chucmungImg}
            alt="Chúc mừng hoàn thành bài đánh giá"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>

        {/* Congratulatory Title */}
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            color: '#1E3A8A',
            mb: 1,
            fontSize: { xs: '22px', sm: '28px' },
            letterSpacing: '-0.5px',
          }}
        >
          {t('assessment.finishTitle', 'Chúc mừng bạn đã hoàn thành bài đánh giá!')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, mb: 4, fontSize: '15px', lineHeight: 1.6 }}
        >
          {t(
            'assessment.finishDesc',
            'Hệ thống đã ghi nhận đáp án và cập nhật điểm số Miền năng lực & Cây kỹ năng AI của bạn.'
          )}
        </Typography>

        {/* Final Score Badge */}
        {summaryData?.finalScore !== undefined && summaryData.finalScore !== null && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              p: 3,
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '1px solid #FDE68A',
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} color="#D97706" mb={1}>
              {t('assessment.finalScoreTitle', 'ĐIỂM TỔNG KẾT')}
            </Typography>
            <Typography variant="h2" fontWeight={900} color="#B45309" sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              {summaryData.finalScore.toFixed(1)}
              <Typography variant="h5" fontWeight={700} color="#D97706" sx={{ opacity: 0.8 }}>/ 10</Typography>
            </Typography>
          </Box>
        )}

        {/* Domain Scores List */}
        {domainScores.length > 0 && (
          <Box width="100%" mb={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                {t('assessment.domainResultTitle', 'Kết quả đánh giá theo Miền năng lực:')}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {domainScores.map((ds) => {
                const info = getDomainInfo(ds.domainCode, ds.domainName, t);

                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={ds.domainCode}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '14px',
                        backgroundColor: info.bg,
                        border: `1px solid ${info.color}30`,
                        textAlign: 'left',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" fontWeight={700} color={info.color}>
                          {info.code}
                        </Typography>
                        <Chip
                          label={`${Math.round(ds.score)}%`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '12px',
                            backgroundColor: info.color,
                            color: '#FFF',
                            height: '24px',
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={1.5}
                        sx={{ fontSize: '11px', minHeight: '32px', lineHeight: 1.3 }}
                      >
                        {info.label}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.max(ds.score, 0), 100)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: `${info.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: info.color,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}

        {/* Action Button to Dashboard */}
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push('/home')}
          endIcon={<IconArrowRight size={20} />}
          sx={{
            background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
            color: '#FFFFFF',
            px: 4,
            py: 1.8,
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '16px',
            textTransform: 'none',
            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)',
              boxShadow: '0 12px 30px rgba(37, 99, 235, 0.45)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {t('assessment.viewDashboardBtn', 'Xem Bảng điều khiển & Cây kỹ năng')}
        </Button>
      </Paper>
    </Box>
  );
};
