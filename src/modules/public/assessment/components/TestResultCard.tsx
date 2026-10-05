'use client';

import React from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, LinearProgress, CircularProgress, Divider } from '@mui/material';
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
      py={{ xs: 2, md: 4 }}
      px={2}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 680,
          width: '100%',
          p: { xs: 2, sm: 5 },
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
            width: { xs: 100, sm: 130 },
            height: { xs: 100, sm: 130 },
            mb: { xs: 1, sm: 2 },
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
            fontSize: { xs: '18px', sm: '28px' },
            letterSpacing: '-0.5px',
          }}
        >
          {t('assessment.finishTitle', 'Chúc mừng bạn đã hoàn thành bài đánh giá!')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, mb: { xs: 3, sm: 4 }, fontSize: { xs: '13px', sm: '15px' }, lineHeight: 1.6 }}
        >
          {t(
            'assessment.finishDesc',
            'Hệ thống đã ghi nhận đáp án và cập nhật điểm số Miền năng lực & Cây kỹ năng AI của bạn.'
          )}
        </Typography>

        {(summaryData?.mcqScore !== undefined || summaryData?.interviewScore !== undefined || summaryData?.finalScore !== undefined) && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={3} mb={5} width="100%">
            
            {/* Final Score Circular Indicator */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box position="relative" display="inline-flex" mb={1.5}>
                {/* Background Track */}
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{ color: '#FEF3C7', width: { xs: '100px !important', sm: '130px !important' }, height: { xs: '100px !important', sm: '130px !important' } }}
                />
                {/* Active Progress */}
                <CircularProgress
                  variant="determinate"
                  value={((summaryData.finalScore || 0) / 10) * 100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: '#F59E0B',
                    position: 'absolute',
                    left: 0,
                    width: { xs: '100px !important', sm: '130px !important' },
                    height: { xs: '100px !important', sm: '130px !important' },
                    '& .MuiCircularProgress-circle': { strokeLinecap: 'round' }
                  }}
                />
                {/* Score Text inside circle */}
                <Box
                  sx={{
                    top: 0, left: 0, bottom: 0, right: 0,
                    position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                  }}
                >
                  <Typography variant="h3" fontWeight={900} color="#B45309" sx={{ lineHeight: 1, fontSize: { xs: '2rem', sm: '2.5rem' } }}>
                    {Math.round((summaryData.finalScore || 0) * 100) / 100}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="#D97706" sx={{ fontSize: { xs: '10px', sm: '12px' }, mt: 0.5 }}>
                    / 10
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" fontWeight={800} color="#D97706" sx={{ fontSize: { xs: '14px', sm: '16px' }, letterSpacing: '0.5px' }}>
                {t('assessment.finalScoreTitle', 'ĐIỂM TỔNG KẾT')}
              </Typography>
            </Box>

            {/* Sub Scores minimal layout */}
            <Box display="flex" justifyContent="center" alignItems="center" gap={{ xs: 3, sm: 6 }} mt={1} width="100%">
              {/* MCQ Score */}
              {summaryData.mcqScore !== undefined && (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h4" fontWeight={800} color="#1E293B" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, lineHeight: 1.2 }}>
                    {Math.round(summaryData.mcqScore * 100) / 100}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="#64748B" sx={{ fontSize: { xs: '10px', sm: '12px' }, mt: 0.5, opacity: 0.8 }}>
                    {t('assessment.mcqScoreTitle', 'TRẮC NGHIỆM')}
                  </Typography>
                </Box>
              )}

              {summaryData.mcqScore !== undefined && summaryData.interviewScore !== undefined && (
                <Divider orientation="vertical" flexItem sx={{ borderColor: '#E2E8F0', borderWidth: '1px', borderRadius: '4px' }} />
              )}

              {/* Interview Score */}
              {summaryData.interviewScore !== undefined && (
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="h4" fontWeight={800} color="#1E293B" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, lineHeight: 1.2 }}>
                    {Math.round(summaryData.interviewScore * 100) / 100}
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="#64748B" sx={{ fontSize: { xs: '10px', sm: '12px' }, mt: 0.5, opacity: 0.8 }}>
                    {t('assessment.interviewScoreTitle', 'PHỎNG VẤN')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Domain Scores List */}
        {domainScores.length > 0 && (
          <Box width="100%" mb={4}>
            <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', sm: 'space-between' }} mb={2}>
              <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ fontSize: { xs: '13px', sm: '0.875rem' } }}>
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
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: '14px',
                        backgroundColor: info.bg,
                        border: `1px solid ${info.color}30`,
                        textAlign: 'left',
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="subtitle2" fontWeight={700} color={info.color} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
                          {info.code}
                        </Typography>
                        <Chip
                          label={`${Math.round(ds.score)}%`}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: '10px', sm: '12px' },
                            backgroundColor: info.color,
                            color: '#FFF',
                            height: { xs: '20px', sm: '24px' },
                          }}
                        />
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={1.5}
                        sx={{ fontSize: { xs: '10px', sm: '11px' }, minHeight: '32px', lineHeight: 1.3 }}
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
            px: { xs: 2, sm: 4 },
            py: { xs: 1.2, sm: 1.8 },
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: { xs: '14px', sm: '16px' },
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
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
