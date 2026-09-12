import React from 'react';
import { Box, Typography, Button, Paper, Grid, Divider, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAssessmentDetail } from '@/apis/assessment/hook/index';
import dayjs from 'dayjs';
import SubmissionDetailAnswers from './components/SubmissionDetailAnswers';

interface SubmissionDetailModuleProps {
  id: number;
}

export default function SubmissionDetailModule({ id }: SubmissionDetailModuleProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });
  const router = useRouter();

  const { data: detailData, isLoading } = useAssessmentDetail(id);
  const detail = detailData?.result;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box>
        <Typography color="error">{t('detail.notFound', 'Không tìm thấy thông tin bài làm.')}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin/submissions')} sx={{ mt: 2 }}>
          {t('action.back', 'Quay lại')}
        </Button>
      </Box>
    );
  }

  const { info, answers } = detail;

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin/submissions')} color="inherit">
          {t('action.back', 'Quay lại')}
        </Button>
        <Typography variant="h4" fontWeight={700}>
          {t('detail.title', 'Chi tiết bài làm #{{id}}', { id: info.id })}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 1 }} elevation={0} variant="outlined">
        <Typography variant="h6" gutterBottom fontWeight={600}>
          {t('detail.generalInfo', 'Thông tin chung')}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.studentName', 'Họ tên')}</Typography>
            <Typography variant="body1" fontWeight={500}>{info.studentName}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.studentEmail', 'Email')}</Typography>
            <Typography variant="body1" fontWeight={500}>{info.studentEmail}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.startedAt', 'Bắt đầu')}</Typography>
            <Typography variant="body1" fontWeight={500}>
              {dayjs(info.startedAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.submittedAt', 'Nộp bài')}</Typography>
            <Typography variant="body1" fontWeight={500}>
              {info.submittedAt ? dayjs(info.submittedAt).format('DD/MM/YYYY HH:mm') : '-'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.status', 'Trạng thái')}</Typography>
            <Typography variant="body1" fontWeight={500}>{info.status}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {detail.aiFeedback && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 1 }} elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
            {t('detail.aiFeedback', 'Nhận xét chung của AI')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {detail.aiFeedback}
          </Typography>
        </Paper>
      )}

      {detail.recommendedResources && detail.recommendedResources.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 1 }} elevation={0} variant="outlined">
          <Typography variant="h6" gutterBottom fontWeight={600} color="secondary.main">
            {t('detail.recommendedResources', 'Tài nguyên gợi ý ôn tập')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {detail.recommendedResources.map(resource => (
              <Grid size={{ xs: 12, md: 6 }} key={resource.id}>
                <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>{resource.title}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>{resource.description}</Typography>
                  <Button size="small" variant="outlined" href={resource.url} target="_blank" rel="noopener">
                    {t('detail.viewResource', 'Xem tài liệu')}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <SubmissionDetailAnswers answers={answers} />
    </Box>
  );
}
