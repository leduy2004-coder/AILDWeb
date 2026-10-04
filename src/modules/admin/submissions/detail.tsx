import React from 'react';
import { Box, Typography, Button, Paper, Grid, Divider, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAssessmentDetail } from '@/apis/assessment/hook/index';
import dayjs from 'dayjs';
import SubmissionDetailAnswers from './components/SubmissionDetailAnswers';
import { Tabs, Tab, Avatar } from '@mui/material';
import { IconUser, IconRobot } from '@tabler/icons-react';

interface SubmissionDetailModuleProps {
  id: number;
}

export default function SubmissionDetailModule({ id }: SubmissionDetailModuleProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });
  const router = useRouter();
  const [tabValue, setTabValue] = React.useState(0);

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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">{t('detail.finalScore', 'Điểm tổng kết')}</Typography>
            <Typography variant="body1" fontWeight={700} color="primary.main">
              {info.finalScore !== null && info.finalScore !== undefined ? `${Math.round(info.finalScore * 100) / 100}/10` : '-'}
            </Typography>
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

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label={t('detail.tabMcq', 'Chi tiết Trắc nghiệm')} />
          <Tab label={t('detail.tabChat', 'Lịch sử Phỏng vấn AI')} />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <SubmissionDetailAnswers answers={answers} />
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 1 }} elevation={0} variant="outlined">
          {!detail.chatHistory || detail.chatHistory.length === 0 ? (
            <Typography color="text.secondary" align="center">{t('detail.noChatHistory', 'Không có lịch sử phỏng vấn AI.')}</Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {detail.chatHistory
                .filter(msg => !msg.content.startsWith('Bắt đầu phỏng vấn. Hãy chào tôi'))
                .map((msg) => {
                const isUser = msg.role === 'USER';
                return (
                  <Box key={msg.id} display="flex" justifyContent={isUser ? 'flex-end' : 'flex-start'} gap={1.5}>
                    {!isUser && (
                      <Avatar sx={{ bgcolor: '#EFF6FF', color: '#1E3A8A', width: 32, height: 32 }}>
                        <IconRobot size={20} />
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 2,
                        borderRadius: '16px',
                        borderTopRightRadius: isUser ? 0 : '16px',
                        borderTopLeftRadius: !isUser ? 0 : '16px',
                        backgroundColor: isUser ? '#1E3A8A' : '#F8FAFC',
                        color: isUser ? 'white' : 'text.primary',
                        border: isUser ? 'none' : '1px solid #E2E8F0',
                        wordBreak: 'break-word',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </Typography>
                    </Box>
                    {isUser && (
                      <Avatar sx={{ bgcolor: '#1E3A8A', width: 32, height: 32 }}>
                        <IconUser size={20} />
                      </Avatar>
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
