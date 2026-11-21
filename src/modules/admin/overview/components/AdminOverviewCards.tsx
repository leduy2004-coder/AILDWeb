import React from 'react';
import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IOverviewResponse } from '@/types/admin/overview.type';
import { IconUsersGroup, IconChecklist, IconChartLine, IconFlag } from '@tabler/icons-react';

interface Props {
  data?: IOverviewResponse;
}

export const AdminOverviewCards = ({ data }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  // Each card opens the list its number is counted from, with the matching filter
  const cards = [
    {
      title: t('totalStudents'),
      value: data?.totalStudents?.toLocaleString() || '0',
      icon: <IconUsersGroup size={24} color={theme.palette.text.secondary} />,
      href: '/admin/users?role=STUDENT',
    },
    {
      title: t('completedAssessments'),
      value: data?.completedAssessments?.toLocaleString() || '0',
      icon: <IconChecklist size={24} color={theme.palette.text.secondary} />,
      href: '/admin/submissions?status=COMPLETED',
    },
    {
      title: t('avgScore'),
      // Out of 10, the same scale as the score column of the submissions list
      value: `${data?.averageCompetencyScore ?? 0} / 10`,
      icon: <IconChartLine size={24} color={theme.palette.text.secondary} />,
      href: '/admin/submissions?status=COMPLETED&sort=score_desc',
    },
    {
      title: t('totalQuestionsKey'),
      value: data?.totalQuestions?.toLocaleString() || '0',
      icon: <IconFlag size={24} color={theme.palette.error.main} />,
      href: '/admin/questions',
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
              justifyContent: 'center',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              '&:hover': { borderColor: theme.palette.primary.main, boxShadow: theme.shadows[2] },
            }}
          >
            <CardActionArea component={Link} href={card.href} sx={{ height: '100%' }}>
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
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
