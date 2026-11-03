import React from 'react';
import { Box, Typography, Paper, Button, Alert, Divider, CircularProgress } from '@mui/material';
import {
  IconListCheck,
  IconClock,
  IconMessageChatbot,
  IconAlertTriangle,
  IconBan,
  IconPlayerPlay,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IAssessmentConfigResponse } from '@/apis/assessment/assessment.api';

interface AssessmentRulesCardProps {
  config: IAssessmentConfigResponse;
  isStarting: boolean;
  onStart: () => void;
  onBack: () => void;
}

export const AssessmentRulesCard: React.FC<AssessmentRulesCardProps> = ({ config, isStarting, onStart, onBack }) => {
  const { t } = useTranslation();

  const overview = [
    {
      icon: <IconListCheck size={22} color="#1E3A8A" />,
      text: t('assessment.rules.questions', {
        count: config.totalQuestions,
        defaultValue: `${config.totalQuestions} câu trắc nghiệm`,
      }),
    },
    {
      icon: <IconMessageChatbot size={22} color="#1E3A8A" />,
      text: t('assessment.rules.interview', {
        count: config.chatMaxTurns,
        defaultValue: `${config.chatMaxTurns} câu phỏng vấn với AI`,
      }),
    },
    {
      icon: <IconClock size={22} color="#1E3A8A" />,
      text: t('assessment.rules.duration', {
        minutes: config.durationMinutes,
        defaultValue: `${config.durationMinutes} phút cho cả bài`,
      }),
    },
  ];

  const violations = [
    t('assessment.rules.violationTab', 'Chuyển sang tab hoặc cửa sổ khác (Ctrl+Tab, Alt+Tab)'),
    t('assessment.rules.violationBlur', 'Click ra ngoài trình duyệt hoặc sang màn hình khác'),
    t('assessment.rules.violationReload', 'Tải lại hoặc đóng trang (thời gian vẫn tiếp tục chạy)'),
    ...(config.requireFullscreen
      ? [t('assessment.rules.violationFullscreen', 'Thoát chế độ toàn màn hình (Esc, F11)')]
      : []),
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 640,
        mx: 'auto',
        p: { xs: 2.5, md: 4 },
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={1}>
        {t('assessment.rules.title', 'Quy định làm bài')}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        {t('assessment.rules.subtitle', 'Bài đánh giá gồm phần trắc nghiệm, sau đó là phần phỏng vấn với AI.')}
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
        {overview.map((item) => (
          <Box key={item.text} display="flex" alignItems="center" gap={1.5}>
            {item.icon}
            <Typography variant="body1" fontWeight={600}>{item.text}</Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <IconAlertTriangle size={22} color="#F59E0B" />
        <Typography variant="h6" fontWeight={700}>
          {t('assessment.rules.violationTitle', 'Các hành vi bị tính là vi phạm')}
        </Typography>
      </Box>
      <Box component="ul" sx={{ m: 0, pl: 3, mb: 2, '& li': { mb: 0.75 } }}>
        {violations.map((v) => (
          <Typography component="li" variant="body1" key={v}>{v}</Typography>
        ))}
      </Box>

      <Alert severity="error" sx={{ mb: 2 }}>
        {t('assessment.rules.violationLimit', {
          max: config.maxViolations,
          defaultValue: `Vi phạm ${config.maxViolations} lần, bài thi sẽ tự động được nộp.`,
        })}
      </Alert>

      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <IconBan size={18} color="#64748B" />
        <Typography variant="body2" color="text.secondary">
          {t('assessment.rules.blocked', 'Trong lúc làm bài không thể sao chép, dán hoặc nhấn chuột phải.')}
        </Typography>
      </Box>

      {config.hasActiveAssessment && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {t('assessment.rules.resumeWarning', 'Bạn đang có bài làm dở. Thời gian vẫn đang chạy và lần quay lại này được tính 1 vi phạm.')}
        </Alert>
      )}

      <Box display="flex" justifyContent="flex-end" gap={2} flexWrap="wrap">
        <Button variant="outlined" onClick={onBack} disabled={isStarting}>
          {t('assessment.rules.back', 'Quay lại')}
        </Button>
        <Button
          variant="contained"
          onClick={onStart}
          disabled={isStarting}
          startIcon={isStarting ? <CircularProgress size={18} color="inherit" /> : <IconPlayerPlay size={20} />}
        >
          {config.hasActiveAssessment
            ? t('assessment.rules.continue', 'Tiếp tục làm bài')
            : t('assessment.rules.start', 'Tôi đã hiểu, bắt đầu làm bài')}
        </Button>
      </Box>
    </Paper>
  );
};
