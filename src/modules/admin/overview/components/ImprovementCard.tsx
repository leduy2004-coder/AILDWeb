import React from 'react';
import { Box, Button, Card, CardContent, Typography, useTheme } from '@mui/material';
import { IconArrowRight, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IImprovementSummary } from '@/types/admin/overview.type';

interface Props {
  data?: IImprovementSummary;
  onOpenList: () => void;
}

/** First vs latest score of the students who retook the assessment; the list opens in a modal. */
export const ImprovementCard = ({ data, onOpenList }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const retakes = data?.retakeStudents ?? 0;
  const first = data?.averageFirstScore;
  const latest = data?.averageLatestScore;
  const delta = first != null && latest != null ? latest - first : null;
  const improvedPercent = retakes ? Math.round(((data?.improvedStudents ?? 0) * 100) / retakes) : 0;
  const up = delta !== null && delta >= 0;

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" fontWeight={600} mb={0.5}>
          {t('improvement.title')}
        </Typography>
        <Typography variant="caption" color="textSecondary" component="p" mb={3}>
          {t('improvement.hint')}
        </Typography>

        {retakes === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4} flex={1}>
            {t('improvement.empty')}
          </Typography>
        ) : (
          <Box flex={1} display="flex" flexDirection="column" gap={3}>
            <Box>
              <Box display="flex" alignItems="baseline" gap={1.5} flexWrap="wrap">
                <Typography variant="h3" fontWeight={700}>{first?.toFixed(2)}</Typography>
                <IconArrowRight size={22} color={theme.palette.text.secondary} />
                <Typography variant="h3" fontWeight={700}>{latest?.toFixed(2)}</Typography>
                <Typography variant="body2" color="text.secondary">/ 10</Typography>
                {delta !== null && (
                  <Box display="flex" alignItems="center" gap={0.5} color={up ? 'success.main' : 'error.main'}>
                    {up ? <IconTrendingUp size={20} /> : <IconTrendingDown size={20} />}
                    <Typography variant="subtitle1" fontWeight={700} color="inherit">
                      {up ? '+' : ''}{delta.toFixed(2)}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t('improvement.firstToLatest')}
              </Typography>
            </Box>

            <Box display="flex" gap={4} flexWrap="wrap">
              <Box>
                <Typography variant="h5" fontWeight={700}>{retakes}</Typography>
                <Typography variant="body2" color="text.secondary">{t('improvement.retakeStudents')}</Typography>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{improvedPercent}%</Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('improvement.improvedStudents', { count: data?.improvedStudents ?? 0 })}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Box mt={2} textAlign="right">
          <Button size="small" endIcon={<IconArrowRight size={16} />} onClick={onOpenList} disabled={retakes === 0}>
            {t('improvement.viewList')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
