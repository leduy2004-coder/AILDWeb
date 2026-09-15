'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';
import { IconClock, IconPlayerPause } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TestQuestionCard } from '@/modules/public/assessment/components/TestQuestionCard';
import { TestResultCard } from '@/modules/public/assessment/components/TestResultCard';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import {
  startAssessment,
  getNextQuestion,
  submitAnswer,
  finishAssessment,
  INextQuestionResponse,
  IAssessmentSummaryResponse,
} from '@/apis/assessment/assessment.api';

export default function AssessmentPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<INextQuestionResponse | null>(null);
  const [summaryData, setSummaryData] = useState<IAssessmentSummaryResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const initRef = React.useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (initRef.current) return;
    initRef.current = true;

    // Start assessment on mount
    const initAssessment = async () => {
      try {
        const startRes = await startAssessment();
        if (startRes.result) {
          setAssessmentId(startRes.result.assessmentId);
          setTimeLeft(startRes.result.durationMinutes * 60);
          setIsStarted(true);
          fetchNextQuestion(startRes.result.assessmentId);
        }
      } catch (error) {
        toast.error(t('assessment.startError', 'Không thể bắt đầu bài thi. Vui lòng thử lại sau.'));
        router.push('/home');
      }
    };
    initAssessment();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer logic
  useEffect(() => {
    if (!isStarted || timeLeft <= 0 || isFinishing) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, timeLeft, isFinishing]);

  const fetchNextQuestion = async (id: number) => {
    try {
      const qRes = await getNextQuestion(id);
      if (qRes.result) {
        const isFinished = qRes.result.isFinished ?? qRes.result.finished;
        if (isFinished) {
          handleFinish(id);
        } else {
          setCurrentQuestion(qRes.result);
        }
      }
    } catch (error) {
      toast.error(t('assessment.loadQuestionError', 'Lỗi khi tải câu hỏi.'));
    }
  };

  const handleNext = async (selectedOptionId: number | null, answerText?: string) => {
    if (!assessmentId || !currentQuestion?.questionId) return;

    setIsSubmitting(true);
    try {
      await submitAnswer(assessmentId, {
        questionId: currentQuestion.questionId,
        selectedOptionId: selectedOptionId || undefined,
        answerText: answerText?.trim(),
      });
      await fetchNextQuestion(assessmentId);
    } catch (error) {
      toast.error(t('assessment.submitAnswerError', 'Lỗi khi lưu đáp án.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async (id: number) => {
    setIsFinishing(true);
    try {
      const res = await finishAssessment(id);
      if (res.result) {
        setSummaryData(res.result);
      }
      toast.success(t('assessment.submitSuccess', 'Nộp bài thành công!'));
    } catch (error) {
      toast.error(t('assessment.submitError', 'Lỗi khi nộp bài.'));
    } finally {
      setIsFinishing(false);
    }
  };

  const handleTimeUp = () => {
    toast.warning(t('assessment.timeUp', 'Hết thời gian làm bài!'));
    if (assessmentId) {
      handleFinish(assessmentId);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isStarted || !currentQuestion) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const progressPercent = currentQuestion.currentIndex && currentQuestion.totalQuestions
    ? ((currentQuestion.currentIndex - 1) / currentQuestion.totalQuestions) * 100
    : 0;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor="#F8FAFC">
      {/* HEADER */}
      <Box
        component="header"
        sx={{
          height: 70,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 3, lg: 4 },
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <Box display="flex" alignItems="center">
          <Logo margin="0" />
        </Box>

        <Box flex={1} display="flex" flexDirection="column" alignItems="center" maxWidth="400px" mx={2}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5}>
            {t('assessment.progress', {
              current: currentQuestion.currentIndex,
              total: currentQuestion.totalQuestions,
              defaultValue: `Câu hỏi ${currentQuestion.currentIndex} trên ${currentQuestion.totalQuestions}`
            })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: '#1E3A8A' } }}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconClock size={20} color={timeLeft < 60 ? '#EF4444' : '#64748B'} />
            <Typography variant="body1" fontWeight={700} color={timeLeft < 60 ? '#EF4444' : 'text.primary'}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
          {/* <IconPlayerPause size={24} color="#94A3B8" style={{ cursor: 'pointer' }} /> */}
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Box flex={1} display="flex" justifyContent="center" alignItems="flex-start" px={{ xs: 2, md: 3, lg: 4 }} py={{ xs: 2, md: 4 }}>
        {isFinishing ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress size={60} />
            <Typography mt={3} variant="h6">{t('assessment.processingResult', 'Đang xử lý kết quả...')}</Typography>
          </Box>
        ) : summaryData ? (
          <TestResultCard summaryData={summaryData} />
        ) : (
          <TestQuestionCard
            domainName={currentQuestion.domainName || ''}
            levelName={currentQuestion.levelName || ''}
            content={currentQuestion.content || ''}
            type={currentQuestion.type}
            options={currentQuestion.options || []}
            onNext={handleNext}
            isSubmitting={isSubmitting}
          />
        )}
      </Box>
    </Box>
  );
}
