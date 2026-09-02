'use client';

import React from 'react';
import { Box, Typography, Grid, LinearProgress, Chip, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IconDots } from '@tabler/icons-react';

// Dynamic import for ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export const HomeProgress = () => {
  const { t } = useTranslation();

  // Radar chart options
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'radar',
      toolbar: { show: false },
    },
    labels: [
      t('home.radar.humanCentered', 'Tư duy lấy\ncon người làm trung tâm'),
      t('home.radar.ethics', 'Đạo đức AI'),
      t('home.radar.application', 'Kỹ thuật &\nỨng dụng AI'),
      t('home.radar.systemDesign', 'Thiết kế\nHệ thống AI'),
    ],
    stroke: {
      width: 2,
      colors: ['#1E3A8A'],
    },
    fill: {
      opacity: 0.1,
      colors: ['#1E3A8A'],
    },
    markers: {
      size: 4,
      colors: ['#1E3A8A'],
      strokeColors: '#1E3A8A',
      strokeWidth: 2,
    },
    yaxis: {
      show: false,
      min: 0,
      max: 100,
    },
    xaxis: {
      labels: {
        style: {
          colors: ['#6B7280', '#6B7280', '#6B7280', '#6B7280'],
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Năng lực',
      data: [80, 95, 30, 45],
    },
  ];

  const progressData = [
    {
      label: t('home.radar.humanCenteredSingleLine', 'Tư duy lấy con người làm trung tâm'),
      value: 80,
      tag: 'ÁP DỤNG',
      color: '#06b6d4', // cyan-500
    },
    {
      label: t('home.radar.ethicsSingleLine', 'Đạo đức AI'),
      value: 95,
      tag: 'SÁNG TẠO',
      color: '#06b6d4',
    },
    {
      label: t('home.radar.applicationSingleLine', 'Kỹ thuật & Ứng dụng AI'),
      value: 30,
      tag: 'HIỂU',
      color: '#06b6d4',
    },
    {
      label: t('home.radar.systemDesignSingleLine', 'Thiết kế Hệ thống AI'),
      value: 45,
      tag: 'ÁP DỤNG',
      color: '#06b6d4',
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        p: 3,
        mb: 5,
        boxShadow: '0px 2px 10px rgba(0,0,0,0.05)',
        border: '1px solid',
        borderColor: 'grey.200',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {t('home.currentProgress', 'Tiến độ hiện tại')}
        </Typography>
        <IconButton size="small">
          <IconDots />
        </IconButton>
      </Box>

      <Grid container spacing={4} alignItems="center">
        {/* Radar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ height: 350, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Chart options={chartOptions} series={chartSeries} type="radar" height={350} width="100%" />
          </Box>
        </Grid>

        {/* Progress Bars */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {progressData.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: '12px',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                    {item.label}
                  </Typography>
                  <Chip
                    label={item.tag}
                    size="small"
                    sx={{
                      borderRadius: '4px',
                      backgroundColor: 'grey.200',
                      color: 'text.secondary',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '24px',
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.value}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'grey.100',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: item.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
