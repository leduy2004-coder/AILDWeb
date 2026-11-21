import React, { useState } from 'react';
import { Box, Card, CardContent, CircularProgress, FormControl, MenuItem, Select, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { IActivityPeriod, useGetActivity } from '@/apis/overview/hook';
import ActivitySubmissionsModal from '../modal/ActivitySubmissionsModal';

const Chart = dynamic(() => import('react-apexcharts').then((mod) => mod.default), { ssr: false });

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Completed assessments (bars) and their average score out of 10 (line).
 * A whole year shows one bar per month, a chosen month one bar per day.
 */
export const ActivityChart = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();
  const [year, setYear] = useState(() => new Date().getFullYear());
  // null = the whole year
  const [month, setMonth] = useState<number | null>(null);
  const { data, isLoading } = useGetActivity(year, month);
  // The clicked bar, whose submissions open in a modal
  const [selectedPeriod, setSelectedPeriod] = useState<IActivityPeriod | null>(null);

  const activity = data?.result;
  const buckets = activity?.buckets ?? [];

  const openBar = (index: number) => {
    const bucket = buckets[index];
    if (!bucket || bucket.completedCount === 0) return;
    const [yyyy, mm, dd] = bucket.periodStart.split('-').map(Number);
    // Year view: a bar is a month; month view: a bar is a day
    setSelectedPeriod({ year: yyyy, month: mm, day: month === null ? null : dd });
  };
  const years = activity?.years?.length ? activity.years : [year];

  // Labels parsed from "yyyy-MM-dd" by parts so they do not shift with the browser time zone
  const categories = buckets.map((b) => {
    const [, mm, dd] = b.periodStart.split('-');
    return month === null ? t(`activity.monthShort.${Number(mm)}`) : `${Number(dd)}`;
  });

  const series = [
    { name: t('activity.completed'), type: 'column', data: buckets.map((b) => b.completedCount) },
    { name: t('activity.averageScore'), type: 'line', data: buckets.map((b) => b.averageScore) },
  ];

  const options: any = {
    chart: {
      toolbar: { show: false },
      fontFamily: theme.typography.fontFamily,
      // A bar (or the score point above it) opens the submissions of that month / day
      events: {
        dataPointSelection: (_e: unknown, _ctx: unknown, config: { dataPointIndex: number }) => openBar(config.dataPointIndex),
      },
    },
    // No lasting "selected" darkening after a click: the click only opens the modal
    states: { active: { filter: { type: 'none' } } },
    colors: [theme.palette.primary.main, theme.palette.warning.main],
    stroke: { width: [0, 3], curve: 'smooth' },
    markers: { size: [0, 4] },
    plotOptions: { bar: { borderRadius: 4, columnWidth: month === null ? '50%' : '70%' } },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      title: {
        text: month === null ? t('activity.axisMonth') : t('activity.axisDay', { month, year }),
        style: { color: theme.palette.text.secondary, fontWeight: 400 },
      },
      labels: { style: { colors: theme.palette.text.secondary }, hideOverlappingLabels: true },
    },
    yaxis: [
      {
        title: { text: t('activity.completed') },
        min: 0,
        forceNiceScale: true,
        labels: { formatter: (val: number) => `${Math.round(val)}`, style: { colors: theme.palette.text.disabled } },
      },
      {
        opposite: true,
        title: { text: t('activity.averageScore') },
        min: 0,
        max: 10,
        tickAmount: 5,
        labels: { formatter: (val: number) => `${val}`, style: { colors: theme.palette.text.disabled } },
      },
    ],
    grid: { borderColor: theme.palette.divider, strokeDashArray: 4 },
    tooltip: {
      theme: theme.palette.mode,
      shared: true,
      intersect: false,
      y: [
        { formatter: (val: number) => t('activity.completedTooltip', { count: val }) },
        { formatter: (val: number | null) => (val === null || val === undefined ? '-' : `${val} / 10`) },
      ],
    },
    legend: { position: 'bottom', labels: { colors: theme.palette.text.secondary } },
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} flexWrap="wrap" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight={600} mb={0.5}>
              {t('activity.title')}
            </Typography>
            <Typography variant="caption" color="textSecondary" component="p">
              {t('activity.hint')}
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => (
                  <MenuItem key={y} value={y}>{y}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <Select
                value={month ?? ''}
                displayEmpty
                onChange={(e) => {
                  const value = e.target.value as number | '';
                  setMonth(value === '' ? null : Number(value));
                }}
              >
                <MenuItem value="">{t('activity.wholeYear')}</MenuItem>
                {MONTHS.map((m) => (
                  <MenuItem key={m} value={m}>{t('activity.monthLong', { month: m })}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box height={300} display="flex" alignItems="center" justifyContent="center">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box width="100%" height="100%" sx={{ '& .apexcharts-bar-area, & .apexcharts-marker': { cursor: 'pointer' } }}>
              <Chart options={options} series={series} type="line" height="100%" />
            </Box>
          )}
        </Box>
      </CardContent>
      <ActivitySubmissionsModal period={selectedPeriod} onClose={() => setSelectedPeriod(null)} />
    </Card>
  );
};
