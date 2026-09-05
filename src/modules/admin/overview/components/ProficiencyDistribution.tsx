import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IProficiencyDistribution } from '@/types/admin/overview.type';

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
                <LinearProgress 
                  variant="determinate" 
                  value={item.percentage} 
                  color={color as any}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
