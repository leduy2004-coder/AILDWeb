import React from 'react';
import { Box, Card, CardContent, LinearProgress, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IScoreParts } from '@/types/admin/overview.type';

interface Props {
  data?: IScoreParts;
}

/**
 * Average multiple-choice and interview score (out of 10) over each student's latest completed assessment.
 * No final score: its weights are an editable setting, so past final scores were not all weighted the same.
 */
export const ScorePartsCard = ({ data }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const rows: { label: string; value: number | null | undefined; color: 'info' | 'warning' }[] = [
    { label: t('scoreParts.mcq'), value: data?.averageMcqScore, color: 'info' },
    { label: t('scoreParts.interview'), value: data?.averageInterviewScore, color: 'warning' },
  ];

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          {t('scoreParts.title')}
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p" mb={3}>
          {t('scoreParts.hint', { count: data?.students ?? 0 })}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          {rows.map((row) => (
            <Box key={row.label}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="textSecondary">{row.label}</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {row.value === null || row.value === undefined ? '-' : `${Number(row.value).toFixed(2)} / 10`}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={row.value ? Math.min(100, Number(row.value) * 10) : 0}
                color={row.color}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
