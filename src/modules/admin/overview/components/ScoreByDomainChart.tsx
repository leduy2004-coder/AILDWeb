import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IDomainScore } from '@/types/admin/overview.type';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

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
    },
    colors: [theme.palette.primary.main],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
        distributed: true, // Will make colors different if we provide array of colors, or just one color
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}%`,
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.primary],
      },
      offsetY: -20,
    },
    stroke: { show: false },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { show: false },
      min: 0,
      max: 100,
    },
    grid: { show: false },
    tooltip: {
      theme: theme.palette.mode,
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    legend: { show: false },
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
        <Box height={280}>
          <Chart options={options} series={series} type="bar" height="100%" />
        </Box>
      </CardContent>
    </Card>
  );
};
