import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, useTheme, linearProgressClasses, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IProficiencyDistribution } from '@/types/admin/overview.type';

const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => {
  const isPrimary = color === 'primary';
  const isSuccess = color === 'success';
  const isInfo = color === 'info';
  
  let mainColor = theme.palette.primary.main;
  let bgColor = theme.palette.primary.light;
  
  if (isSuccess) {
    mainColor = theme.palette.success.main;
    bgColor = theme.palette.success.light;
  } else if (isInfo) {
    mainColor = theme.palette.info.main;
    bgColor = theme.palette.info.light;
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

interface Props {
  data?: IProficiencyDistribution[];
}

export const ProficiencyDistribution = ({ data = [] }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" fontWeight={600} mb={4}>
          {t('proficiencyDistribution')}
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          {data.map((item, index) => {
            const color = index === 0 ? 'info' : index === 1 ? 'primary' : 'success';
            return (
              <Box key={index}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    {t(item.levelName)}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.round(item.percentage)}%
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
