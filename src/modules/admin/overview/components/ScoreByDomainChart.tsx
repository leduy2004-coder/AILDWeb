import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IDomainScore } from '@/types/admin/overview.type';

const Chart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), { ssr: false });

interface Props {
  data?: IDomainScore[];
}

export const ScoreByDomainChart = ({ data = [] }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const categories = data.map((d) => t(d.domainName));
  const seriesData = data.map((d) => d.averageScore);

  const options: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      }
    },
    colors: [
      theme.palette.primary.main, 
      theme.palette.success.main, 
      theme.palette.warning.main, 
      theme.palette.info.main
    ],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        distributed: true,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.7,
        stops: [0, 100]
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      style: {
        fontSize: '11px',
        fontWeight: 600,
        colors: [theme.palette.mode === 'dark' ? '#fff' : '#000'],
      },
      offsetY: -20,
      background: {
        enabled: true,
        foreColor: theme.palette.mode === 'dark' ? '#000' : '#fff',
        borderRadius: 2,
        padding: 3,
        opacity: 0.7,
        borderWidth: 0
      }
    },
    stroke: { show: false },
    xaxis: {
      categories,
      labels: {
        show: false
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { 
        style: {
          colors: theme.palette.text.disabled,
        },
        formatter: (val: number) => `${val}%`,
      },
      min: 0,
      max: 100,
      tickAmount: 5,
    },
    grid: { 
      show: true,
      borderColor: theme.palette.divider,
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: { 
      show: true, 
      position: 'bottom',
      labels: {
        colors: theme.palette.text.secondary
      }
    },
  };

  const series = [
    {
      name: t('scoreByDomain'),
      data: seriesData,
    },
  ];

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
          {t('scoreByDomain')}
        </Typography>
        <Box height={320}>
          <Chart options={options} series={series} type="bar" height="100%" />
        </Box>
      </CardContent>
    </Card>
  );
};
