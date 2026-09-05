import React from 'react';
import { Box, Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IOverviewResponse } from '@/types/admin/overview.type';
import { IconUsersGroup, IconChecklist, IconChartLine, IconFlag } from '@tabler/icons-react';

interface Props {
  data?: IOverviewResponse;
}

export const AdminOverviewCards = ({ data }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const cards = [
    {
      title: t('totalStudents'),
      value: data?.totalStudents?.toLocaleString() || '0',
      icon: <IconUsersGroup size={24} color={theme.palette.text.secondary} />,
    },
    {
      title: t('completedAssessments'),
      value: data?.completedAssessments?.toLocaleString() || '0',
      icon: <IconChecklist size={24} color={theme.palette.text.secondary} />,
    },
    {
      title: t('avgScore'),
      value: data?.averageCompetencyScore ? `${data.averageCompetencyScore}%` : '0%',
      icon: <IconChartLine size={24} color={theme.palette.text.secondary} />,
    },
    {
      title: t('questionsNeedingAttention'),
      value: data?.questionsNeedingAttention?.toLocaleString() || '0',
      icon: <IconFlag size={24} color={theme.palette.error.main} />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 1, 
              border: `1px solid ${theme.palette.divider}`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="subtitle2" color="textSecondary" fontWeight={600}>
                  {card.title}
                </Typography>
                <Box>{card.icon}</Box>
              </Box>
              <Typography variant="h3" fontWeight={700}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
