import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, useTheme, linearProgressClasses, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IProficiencyDistribution } from '@/types/admin/overview.type';

const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => {
  let mainColor = theme.palette.primary.main;
  let bgColor = theme.palette.primary.light;

  if (color === 'success') {
    mainColor = theme.palette.success.main;
    bgColor = theme.palette.success.light;
  } else if (color === 'info') {
    mainColor = theme.palette.info.main;
    bgColor = theme.palette.info.light;
  } else if (color === 'inherit') {
    mainColor = theme.palette.grey[500];
    bgColor = theme.palette.grey[200];
  }

  return {
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.mode === 'light' ? bgColor : theme.palette.grey[800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: mainColor,
      backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)`,
      backgroundSize: '1rem 1rem',
      animation: 'progress-stripes 1s linear infinite'
    },
    '@keyframes progress-stripes': {
      from: { backgroundPosition: '1rem 0' },
      to: { backgroundPosition: '0 0' }
    }
  };
});

// Color by level, not by row position: 0 = not reached, then Understand / Apply / Create
const LEVEL_COLOR: Record<number, 'inherit' | 'info' | 'primary' | 'success'> = {
  0: 'inherit',
  1: 'info',
  2: 'primary',
  3: 'success',
};

interface Props {
  data?: IProficiencyDistribution[];
}

export const ProficiencyDistribution = ({ data = [] }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();
  const totalStudents = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          {t('proficiencyDistribution')}
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p" mb={3}>
          {t('proficiencyDistributionHint', { count: totalStudents })}
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          {data.map((item) => {
            const color = LEVEL_COLOR[item.levelId] ?? 'primary';
            return (
              <Box key={item.levelId}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    {t(item.levelName)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {t('studentCount', { count: item.count })} · {Math.round(item.percentage)}%
                  </Typography>
                </Box>
                <BorderLinearProgress 
                  variant="determinate" 
                  value={item.percentage} 
                  color={color as any}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
