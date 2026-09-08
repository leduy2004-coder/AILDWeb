'use client';

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Alert,
  Paper,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import {
  IconLock,
  IconLockOpen,
  IconCheck,
  IconAlertTriangle,
  IconBrain,
  IconShieldCheck,
  IconCpu,
  IconHierarchy2,
  IconChartRadar,
} from '@tabler/icons-react';
import { IDomainProgress, ISkillNode } from '@/types/student/student-dashboard.type';

const Chart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), { ssr: false });

interface HomeProgressProps {
  domainProgresses?: IDomainProgress[];
  skillNodes?: ISkillNode[];
  isEvaluated?: boolean;
  lastEvaluationDate?: string | null;
}

export const HomeProgress: React.FC<HomeProgressProps> = ({
  domainProgresses = [],
  skillNodes = [],
  isEvaluated = false,
  lastEvaluationDate = null,
}) => {
  const { t, i18n } = useTranslation();

  const domainLabelsMap: Record<string, string> = {
    HCM: t('home.radar.humanCenteredSingleLine', 'Tư duy lấy con người làm trung tâm'),
    ETHICS: t('home.radar.ethicsSingleLine', 'Đạo đức AI'),
    TECH: t('home.radar.applicationSingleLine', 'Kỹ thuật & Ứng dụng AI'),
    DESIGN: t('home.radar.systemDesignSingleLine', 'Thiết kế Hệ thống AI'),
  };

  // Concise Axis Labels for 4 Corners of Radar Chart (Prevents Outer Clipping)
  const domainChartLabelsMap: Record<string, string> = {
    HCM: 'HCM',
    ETHICS: 'ETHICS',
    TECH: 'TECH',
    DESIGN: 'DESIGN',
  };

  const domainThemeMap: Record<
    string,
    { icon: React.ReactNode; bgGradient: string; textPrimary: string; border: string }
  > = {
    HCM: {
      icon: <IconBrain size={20} color="#FFFFFF" />,
      bgGradient: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      textPrimary: '#4338CA',
      border: '#C7D2FE',
    },
    ETHICS: {
      icon: <IconShieldCheck size={20} color="#FFFFFF" />,
      bgGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      textPrimary: '#047857',
      border: '#A7F3D0',
    },
    TECH: {
      icon: <IconCpu size={20} color="#FFFFFF" />,
      bgGradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
      textPrimary: '#0369A1',
      border: '#BAE6FD',
    },
    DESIGN: {
      icon: <IconHierarchy2 size={20} color="#FFFFFF" />,
      bgGradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)',
      textPrimary: '#B45309',
      border: '#FDE68A',
    },
  };

  const defaultDomains = ['HCM', 'ETHICS', 'TECH', 'DESIGN'];
  const defaultLevels = ['UNDERSTAND', 'APPLY', 'CREATE'];

  const levelNameMap: Record<string, string> = {
    UNDERSTAND: t('home.level.UNDERSTAND', 'HIỂU'),
    APPLY: t('home.level.APPLY', 'ÁP DỤNG'),
    CREATE: t('home.level.CREATE', 'SÁNG TẠO'),
  };

  const shortDomainTitleMap: Record<string, string> = {
    HCM: t('home.radar.domainShort.HCM', 'Tư duy AI'),
    ETHICS: t('home.radar.domainShort.ETHICS', 'Đạo đức AI'),
    TECH: t('home.radar.domainShort.TECH', 'Kỹ thuật AI'),
    DESIGN: t('home.radar.domainShort.DESIGN', 'Thiết kế hệ thống'),
  };

  // Map progress items matching default 4 domains for the Radar Chart
  const progressItems = defaultDomains.map((code) => {
    const found = domainProgresses.find((d) => d.domainCode === code);
    const scoreVal = found ? (found.score ?? 0) : 0;
    return {
      code,
      label: domainLabelsMap[code] || code,
      chartLabel: domainChartLabelsMap[code] || code,
      value: isEvaluated ? scoreVal : 0,
    };
  });

  const chartSeries = [
    {
      name: t('admin_overview.table.score', 'Điểm năng lực'),
      data: progressItems.map((item) => item.value),
    },
  ];

  // Radar Chart Options with Ample Offsets
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
      offsetY: 0,
      dropShadow: {
        enabled: true,
        blur: 6,
        left: 0,
        top: 2,
        opacity: 0.12,
      },
    },
    labels: progressItems.map((item) => item.chartLabel),
    stroke: {
      width: 3.5,
      colors: ['#1E3A8A'],
    },
    fill: {
      opacity: 0.3,
      colors: ['#2563EB'],
    },
    markers: {
      size: 7,
      colors: ['#1E3A8A'],
      strokeColors: '#ffffff',
      strokeWidth: 3,
      hover: { size: 9 },
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
    },
    xaxis: {
      labels: {
        style: {
          colors: ['#1E293B', '#1E293B', '#1E293B', '#1E293B'],
          fontSize: '12px',
          fontWeight: 700,
        },
      },
    },
    grid: {
      padding: {
        top: 15,
        right: 35,
        bottom: 15,
        left: 35,
      },
    },
    plotOptions: {
      radar: {
        size: 125,
        polygons: {
          strokeColors: '#CBD5E1',
          connectorColors: '#CBD5E1',
          fill: {
            colors: ['#F8FAFC', '#FFFFFF'],
          },
        },
      },
    },
  };

  const completedCount = skillNodes.filter((n) => n.status === 'COMPLETED').length;

  const formattedLastEvalDate = lastEvaluationDate
    ? new Date(lastEvaluationDate).toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  return (
    <Box display="flex" flexDirection="column" gap={3} mb={5}>
      {/* TOP HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: '12px',
              backgroundColor: '#1E3A8A',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconChartRadar size={26} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {t('home.currentProgress', 'Năng lực & Cây kỹ năng AI')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.skillTree.subtitle', 'Khung đánh giá 4 Miền năng lực × 3 Mức tiến trình (12 Node)')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {isEvaluated ? (
        <Alert severity="success" sx={{ borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}>
          {t('home.evaluatedAlert', {
            date: formattedLastEvalDate,
            defaultValue: `Đã làm bài đánh giá vào lúc ${formattedLastEvalDate}`,
          })}
        </Alert>
      ) : (
        <Alert severity="info" sx={{ borderRadius: '12px', fontSize: '14px', fontWeight: 500 }}>
          {t(
            'home.noEvaluationDesc',
            'Bạn chưa thực hiện bài đánh giá nào. Hãy bắt đầu bài đánh giá mới để đo lường năng lực AI của bạn!'
          )}
        </Alert>
      )}

      {/* MAIN SIDE-BY-SIDE GRID LAYOUT */}
      <Grid container spacing={3} alignItems="stretch">
        {/* LEFT COLUMN: RADAR CHART */}
        <Grid size={{ xs: 12, lg: 5.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h5" fontWeight={700} color="text.primary">
                {t('home.radar.title', 'Biểu đồ Năng lực AI')}
              </Typography>
              <Chip
                label={isEvaluated ? t('home.radar.evaluated', 'Đã đánh giá') : t('home.radar.notEvaluated', 'Chưa đánh giá')}
                color={isEvaluated ? 'primary' : 'default'}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" mb={1.5}>
              {t('home.radar.subtitle', 'Thang đo năng lực 0 - 100% (4 miền năng lực QĐ 3439/UNESCO)')}
            </Typography>

            {/* Center Radar Chart - Ample Padding to Prevent Text Clipping */}
            <Box
              sx={{
                flexGrow: 1,
                minHeight: 350,
                height: 370,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 1,
                py: 1,
                overflow: 'visible',
                '& .apexcharts-canvas, & svg': {
                  overflow: 'visible !important',
                },
              }}
            >
              <Chart options={chartOptions} series={chartSeries} type="radar" height={370} width="100%" />
            </Box>

            {/* DOMAIN LEGEND LIST BELOW CHART - FULL TEXT WITHOUT CLIPPING */}
            <Box display="flex" flexDirection="column" gap={1.5} mt={2} pt={2} borderTop="1px dashed #E2E8F0">
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {t('home.radar.legendTitle', 'Chú thích 4 miền năng lực:')}
              </Typography>
              <Grid container spacing={1.5}>
                {progressItems.map((item) => {
                  const theme = domainThemeMap[item.code] || domainThemeMap.HCM;
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={item.code}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          border: `1.5px solid ${theme.border}`,
                          backgroundColor: '#F8FAFC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1.5,
                          height: '100%',
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1.2}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '8px',
                              background: theme.bgGradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {theme.icon}
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight={700}
                              color={theme.textPrimary}
                              sx={{ lineHeight: 1.2, fontSize: '12px' }}
                            >
                              {item.code}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: '11px', display: 'block', lineHeight: 1.3 }}
                            >
                              {item.label}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={`${item.value}%`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '12px',
                            height: '24px',
                            backgroundColor: '#1E3A8A',
                            color: '#FFF',
                            flexShrink: 0,
                          }}
                        />
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: VERTICAL SKILL TREE GRAPH (4 DOMAIN COLUMNS x 3 LEVEL NODES) */}
        <Grid size={{ xs: 12, lg: 6.5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'grey.200',
              backgroundColor: '#FFFFFF',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  {t('home.skillTree.title', 'Cây Kỹ Năng AI (12 Node)')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('home.skillTree.verticalSubtitle', 'Cấu trúc tiến trình theo chiều dọc (Level 1 ➔ Level 2 ➔ Level 3)')}
                </Typography>
              </Box>
              <Chip
                icon={<IconCheck size={16} style={{ color: '#FFFFFF' }} />}
                label={t('home.skillTree.completedShort', {
                  completed: completedCount,
                  defaultValue: `Đã đạt ${completedCount}/12`,
                })}
                sx={{
                  fontWeight: 700,
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  boxShadow: '0 3px 10px rgba(16, 185, 129, 0.25)',
                  '& .MuiChip-icon': { color: '#FFFFFF' },
                }}
              />
            </Box>

            {/* 4 Vertical Skill Tree Columns */}
            <Grid container spacing={1.5} sx={{ flexGrow: 1 }} alignItems="stretch">
              {defaultDomains.map((domainCode) => {
                const theme = domainThemeMap[domainCode] || domainThemeMap.HCM;

                return (
                  <Grid size={{ xs: 6, sm: 3 }} key={domainCode}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '14px',
                        backgroundColor: '#F8FAFC',
                        border: `1.5px solid ${theme.border}`,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Column Domain Header */}
                      <Box
                        sx={{
                          width: '100%',
                          py: 1,
                          px: 0.5,
                          borderRadius: '10px',
                          background: theme.bgGradient,
                          color: '#FFF',
                          textAlign: 'center',
                          mb: 2,
                          boxShadow: '0px 3px 8px rgba(0,0,0,0.12)',
                        }}
                      >
                        <Box display="flex" justifyContent="center" mb={0.3}>
                          {theme.icon}
                        </Box>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          display="block"
                          sx={{ fontSize: '11px', lineHeight: 1.2 }}
                        >
                          {shortDomainTitleMap[domainCode] || domainCode}
                        </Typography>
                      </Box>

                      {/* Vertical Level Nodes */}
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1.2}
                        width="100%"
                        my="auto"
                      >
                        {defaultLevels.map((levelCode, lvlIdx) => {
                          const nodeData = skillNodes.find(
                            (n) => n.domainCode === domainCode && n.levelCode === levelCode
                          );
                          const status = nodeData?.status || (lvlIdx === 0 ? 'UNLOCKED' : 'LOCKED');
                          const needsReview = nodeData?.needsReview || false;
                          const levelTitle = levelNameMap[levelCode] || levelCode;

                          const isCompleted = status === 'COMPLETED';
                          const isUnlocked = status === 'UNLOCKED';
                          const isLocked = status === 'LOCKED';

                          return (
                            <React.Fragment key={levelCode}>
                              {/* Node Item Container */}
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <Paper
                                  elevation={0}
                                  sx={{
                                    width: '100%',
                                    py: 1.2,
                                    px: 0.8,
                                    borderRadius: '12px',
                                    border: '2px solid',
                                    borderColor: isCompleted
                                      ? '#10B981'
                                      : isUnlocked
                                        ? '#3B82F6'
                                        : '#E2E8F0',
                                    backgroundColor: isCompleted
                                      ? '#ECFDF5'
                                      : isUnlocked
                                        ? '#EFF6FF'
                                        : '#FFFFFF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                      transform: 'scale(1.04)',
                                      boxShadow: isCompleted
                                        ? '0px 4px 12px rgba(16,185,129,0.25)'
                                        : isUnlocked
                                          ? '0px 4px 12px rgba(59,130,246,0.25)'
                                          : 'none',
                                    },
                                  }}
                                >
                                  {/* Circular Badge Icon */}
                                  <Box
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      background: isCompleted
                                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                                        : isUnlocked
                                          ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
                                          : '#F1F5F9',
                                      boxShadow: isCompleted
                                        ? '0px 3px 8px rgba(16,185,129,0.3)'
                                        : isUnlocked
                                          ? '0px 3px 8px rgba(59,130,246,0.3)'
                                          : 'none',
                                    }}
                                  >
                                    {isCompleted ? (
                                      <IconCheck size={18} color="#FFFFFF" />
                                    ) : isUnlocked ? (
                                      <IconLockOpen size={16} color="#FFFFFF" />
                                    ) : (
                                      <IconLock size={16} color="#94A3B8" />
                                    )}
                                  </Box>

                                  <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    sx={{
                                      color: isCompleted
                                        ? '#065F46'
                                        : isUnlocked
                                          ? '#1E40AF'
                                          : '#64748B',
                                      fontSize: '11px',
                                    }}
                                  >
                                    {levelTitle}
                                  </Typography>

                                  <Chip
                                    label={
                                      isCompleted
                                        ? t('home.skillTree.status.COMPLETED', 'Đã đạt')
                                        : isUnlocked
                                          ? t('home.skillTree.status.UNLOCKED', 'Sẵn sàng')
                                          : t('home.skillTree.status.LOCKED', 'Khóa')
                                    }
                                    size="small"
                                    sx={{
                                      height: '18px',
                                      fontSize: '9px',
                                      fontWeight: 700,
                                      backgroundColor: isCompleted
                                        ? '#10B981'
                                        : isUnlocked
                                          ? '#3B82F6'
                                          : '#CBD5E1',
                                      color: isCompleted || isUnlocked ? '#FFFFFF' : '#475569',
                                    }}
                                  />

                                  {needsReview && (
                                    <Tooltip title={t('home.skillTree.needsReview', 'Gợi ý ôn tập')}>
                                      <Chip
                                        icon={<IconAlertTriangle size={11} color="#D97706" />}
                                        label={t('home.skillTree.needsReview', 'Ôn tập')}
                                        size="small"
                                        sx={{
                                          height: '18px',
                                          fontSize: '9px',
                                          fontWeight: 700,
                                          backgroundColor: '#FEF3C7',
                                          color: '#B45309',
                                          border: '1px solid #FCD34D',
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </Paper>
                              </Box>

                              {/* Vertical Line Connection */}
                              {lvlIdx < defaultLevels.length - 1 && (
                                <Box
                                  sx={{
                                    width: '3px',
                                    height: '18px',
                                    backgroundColor: isCompleted ? '#10B981' : '#CBD5E1',
                                    borderRadius: '2px',
                                    my: -0.2,
                                  }}
                                />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            {/* COLOR STATUS LEGEND BAR AT BOTTOM OF SKILL TREE - SPACIOUS AND UNCLIPPED */}
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mt: 2.5,
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                {t('home.skillTree.legend.title', 'Chú thích trạng thái:')}
              </Typography>

              <Chip
                icon={<IconCheck size={13} color="#FFFFFF" />}
                label={t('home.skillTree.legend.completed', 'Đã đạt')}
                size="small"
                sx={{
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '11px',
                  height: '24px',
                }}
              />

              <Chip
                icon={<IconLockOpen size={13} color="#FFFFFF" />}
                label={t('home.skillTree.legend.unlocked', 'Sẵn sàng')}
                size="small"
                sx={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '11px',
                  height: '24px',
                }}
              />

              <Chip
                icon={<IconLock size={13} color="#475569" />}
                label={t('home.skillTree.legend.locked', 'Đã khóa')}
                size="small"
                sx={{
                  backgroundColor: '#CBD5E1',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '11px',
                  height: '24px',
                }}
              />

              <Chip
                icon={<IconAlertTriangle size={13} color="#D97706" />}
                label={t('home.skillTree.legend.review', 'Gợi ý ôn tập')}
                size="small"
                sx={{
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FCD34D',
                  fontWeight: 700,
                  fontSize: '11px',
                  height: '24px',
                }}
              />
            </Paper>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
