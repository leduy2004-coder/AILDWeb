import React from 'react';
import Link from 'next/link';
import { Box, Card, CardActionArea, CardContent, Typography, Grid, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IOverviewResponse } from '@/types/admin/overview.type';
import { IconUsersGroup, IconChecklist, IconChartLine, IconFlag } from '@tabler/icons-react';

interface Props {
  data?: IOverviewResponse;
}

/** A small "label ... value" line under a card's main number; colored when the value needs attention. */
const DetailLine = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <Box display="flex" justifyContent="space-between" gap={1}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="caption" fontWeight={600} color={color}>{value}</Typography>
  </Box>
);

export const AdminOverviewCards = ({ data }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const status = data?.assessmentStatus;
  const completed = data?.completedAssessments ?? 0;
  const totalStudents = data?.totalStudents ?? 0;
  const withPercent = (count: number, total: number) => (total ? `${count} (${Math.round((count * 100) / total)}%)` : `${count}`);

  // Each card opens the list its number is counted from, with the matching filter
  const cards: { title: string; value: string; icon: React.ReactNode; href: string; details?: React.ReactNode }[] = [
    {
      title: t('totalStudents'),
      value: totalStudents.toLocaleString(),
      icon: <IconUsersGroup size={24} color={theme.palette.text.secondary} />,
      href: '/admin/users?role=STUDENT',
      details: status && (
        <DetailLine label={t('assessmentStatus.studentsCompleted')} value={withPercent(status.studentsCompleted, totalStudents)} />
      ),
    },
    {
      title: t('completedAssessments'),
      value: completed.toLocaleString(),
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
            <CardActionArea
              component={Link}
              href={card.href}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
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
                {card.details && (
                  <Box mt={1.5} pt={1} borderTop={`1px dashed ${theme.palette.divider}`} display="flex" flexDirection="column" gap={0.25}>
                    {card.details}
                  </Box>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
