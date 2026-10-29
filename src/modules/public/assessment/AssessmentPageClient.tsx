'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { IconClock, IconPlayerPause, IconAlertTriangle, IconMaximize } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TestQuestionCard } from '@/modules/public/assessment/components/TestQuestionCard';
import { getLocalizedDomain, getLocalizedLevel } from '@/modules/public/home/constant/home-resource.constant';
import { TestChatRoom } from '@/modules/public/assessment/components/TestChatRoom';
import { TestResultCard } from '@/modules/public/assessment/components/TestResultCard';
import { AssessmentRulesCard } from '@/modules/public/assessment/components/AssessmentRulesCard';
import { useAntiCheat } from '@/modules/public/assessment/hooks/useAntiCheat';
import Logo from '@/app/(DashboardLayout)/layout/shared/logo/Logo';
import {
  getAssessmentConfig,
  startAssessment,
  getNextQuestion,
  submitAnswer,
  finishAssessment,
  timeUpAssessment,
  reportViolation,
  INextQuestionResponse,
  IAssessmentSummaryResponse,
  IAssessmentConfigResponse,
} from '@/apis/assessment/assessment.api';

export default function AssessmentPageClient() {
  const { t } = useTranslation();
  const router = useRouter();

  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [chatMaxTurns, setChatMaxTurns] = useState<number>(4);
  const [currentQuestion, setCurrentQuestion] = useState<INextQuestionResponse | null>(null);
  const [summaryData, setSummaryData] = useState<IAssessmentSummaryResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [timeUpError, setTimeUpError] = useState(false);
  const initRef = React.useRef(false);
  const timeUpHandledRef = React.useRef(false);
  const finishingRef = React.useRef(false);

  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [violationCount, setViolationCount] = useState(0);
  const [maxViolations, setMaxViolations] = useState(3);
  const [requireFullscreen, setRequireFullscreen] = useState(false);
  const [violationWarning, setViolationWarning] = useState<number | null>(null);
  const [config, setConfig] = useState<IAssessmentConfigResponse | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const isCompleted = summaryData?.status === 'COMPLETED';

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (initRef.current) return;
    initRef.current = true;

    // Show the rules first; the clock only starts when the student clicks start
    getAssessmentConfig()
      .then((res) => setConfig(res.result))
      .catch(() => {
        toast.error(t('assessment.startError', 'Không thể bắt đầu bài thi. Vui lòng thử lại sau.'));
        router.push('/home');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer logic
  useEffect(() => {
    if (!isStarted || isFinishing || isCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isFinishing, isCompleted]);

  // Time up trigger
  useEffect(() => {
    if (isStarted && timeLeft === 0 && !isCompleted && !timeUpHandledRef.current) {
      timeUpHandledRef.current = true;
      handleTimeUp();
    }
  }, [isStarted, timeLeft, isCompleted]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleNext = async (selectedOptionId: number | null) => {
    if (!assessmentId || !currentQuestion?.questionId) return;

    setIsSubmitting(true);
    try {
      await submitAnswer(assessmentId, {
        questionId: currentQuestion.questionId,
        selectedOptionId: selectedOptionId || undefined,
      });
      await fetchNextQuestion(assessmentId);
    } catch (error) {
      toast.error(t('assessment.submitAnswerError', 'Lỗi khi lưu đáp án.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async (id: number) => {
    if (finishingRef.current || timeUpHandledRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    try {
      const res = await finishAssessment(id);
      if (res.result) {
        setSummaryData(res.result);
      }
      if (res.result?.status === 'INTERVIEWING') {
        toast.success(t('assessment.mcqSubmitSuccess', 'Nộp bài trắc nghiệm thành công! Tiếp theo là phần phỏng vấn với AI.'));
      } else {
        toast.success(t('assessment.submitSuccess', 'Nộp bài thành công!'));
      }
    } catch (error) {
      toast.error(t('assessment.submitError', 'Lỗi khi nộp bài.'));
    } finally {
      finishingRef.current = false;
      setIsFinishing(false);
    }
  };

  const handleChatFinish = async (finalScore?: number, interviewScore?: number) => {
    // If we need to refetch summary from server, we can do it here. 
    // Or just trust that backend status is COMPLETED now and refetch the detail.
    // However, we already have summaryData, we can just update its status and scores
    setSummaryData(prev => prev ? {
      ...prev,
      status: 'COMPLETED',
      finalScore: finalScore,
      interviewScore: interviewScore,
    } : null);
    toast.success(t('assessment.chatFinishSuccess', 'Tuyệt vời, bạn đã hoàn thành phần phỏng vấn!'));
  };

  const handleForceSubmit = (id: number | null = assessmentId) => {
    // A normal submit is already running, let it finish
    if (finishingRef.current || timeUpHandledRef.current) return;
    timeUpHandledRef.current = true;
    setViolationWarning(null);
    toast.error(t('assessment.antiCheat.forceSubmitted', 'Bạn đã rời khỏi bài thi quá nhiều lần. Bài thi đã được tự động nộp.'));
    handleTimeUp(false, id);
  };

  const handleTimeUp = async (showTimeUpToast = true, id: number | null = assessmentId) => {
    if (!id) return;
    if (showTimeUpToast) toast.warning(t('assessment.timeUp', 'Hết thời gian làm bài!'));
    setTimeUpError(false);
    setIsFinishing(true);
    try {
      const res = await timeUpAssessment(id);
      if (res.result) {
        setSummaryData(res.result);
      }
    } catch (error) {
      setTimeUpError(true);
    } finally {
      setIsFinishing(false);
    }
  };

  const handleViolation = async () => {
    if (!assessmentId || timeUpHandledRef.current) return;
    try {
      const res = await reportViolation(assessmentId);
      const result = res.result;
      if (!result) return;
      setViolationCount(result.violationCount);
      setMaxViolations(result.maxViolations);

      if (result.status === 'COMPLETED' && result.summary) {
        timeUpHandledRef.current = true;
        setViolationWarning(null);
        setSummaryData(result.summary);
        if (result.violationCount >= result.maxViolations) {
          toast.error(t('assessment.antiCheat.forceSubmitted', 'Bạn đã rời khỏi bài thi quá nhiều lần. Bài thi đã được tự động nộp.'));
        }
      } else if (result.violationCount >= result.maxViolations) {
        // Server could not grade (AI unavailable): fall back to time-up, which has a retry screen
        handleForceSubmit();
      } else {
        setViolationWarning(result.violationCount);
      }
    } catch (error) {
      // Network error: the violation is lost, the test goes on
    }
  };

  const { needsFullscreen, enterFullscreen } = useAntiCheat({
    enabled: isStarted && !isCompleted && !timeUpError,
    requireFullscreen,
    onViolation: handleViolation,
  });

  const handleStartAssessment = async () => {
    if (isStarting) return;
    // Must run inside the click handler: browsers only allow fullscreen on a user gesture
    if (config?.requireFullscreen) enterFullscreen();
    setIsStarting(true);
    try {
      const startRes = await startAssessment();
      const result = startRes.result;
      if (result) {
        setAssessmentId(result.assessmentId);
        setChatMaxTurns(result.chatMaxTurns || 4);
        setTotalQuestions(result.totalQuestions);
        // Remaining time comes from the server so reloading does not reset the clock
        setTimeLeft(result.remainingSeconds);
        setViolationCount(result.violationCount);
        setMaxViolations(result.maxViolations);
        setRequireFullscreen(result.requireFullscreen);
        setIsStarted(true);

        const reachedLimit = result.violationCount >= result.maxViolations;
        if (result.status === 'COMPLETED') {
          // Resumed after the deadline or with the last violation: show the result directly
          timeUpHandledRef.current = true;
          if (result.summary) setSummaryData(result.summary);
          if (reachedLimit) {
            toast.error(t('assessment.antiCheat.forceSubmitted', 'Bạn đã rời khỏi bài thi quá nhiều lần. Bài thi đã được tự động nộp.'));
          }
          return;
        }

        if (reachedLimit) {
          handleForceSubmit(result.assessmentId);
        } else if (result.violationCount > 0) {
          // Reloading/closing the page was counted as a violation
          setViolationWarning(result.violationCount);
        }

        if (result.status === 'INTERVIEWING' && result.summary) {
          setSummaryData(result.summary);
        } else {
          fetchNextQuestion(result.assessmentId);
        }
      }
    } catch (error) {
      toast.error(t('assessment.startError', 'Không thể bắt đầu bài thi. Vui lòng thử lại sau.'));
      router.push('/home');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isStarted) {
    if (!config) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      );
    }
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#F8FAFC" px={2} py={4}>
        <AssessmentRulesCard
          config={config}
          isStarting={isStarting}
          onStart={handleStartAssessment}
          onBack={() => router.push('/home')}
        />
      </Box>
    );
  }

  // A resumed interview has no current question, only the summary
  if (!isStarted || (!currentQuestion && !summaryData)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const progressCurrent = currentQuestion?.currentIndex ?? totalQuestions;
  const progressTotal = currentQuestion?.totalQuestions ?? totalQuestions;
  const progressPercent = progressCurrent && progressTotal ? (progressCurrent / progressTotal) * 100 : 0;

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
          px: { xs: 2, md: 8, lg: 10 },
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        }}
      >
        <Box flex={1} display="flex" alignItems="center" justifyContent="flex-start">
          <Logo margin="0" href="/home" />
        </Box>

        <Box flex={2} display="flex" flexDirection="column" alignItems="center" maxWidth="400px" mx={2}>
          <Typography variant="caption" fontWeight={600} color="text.secondary" mb={0.5}>
            {t('assessment.progress', {
              current: progressCurrent,
              total: progressTotal,
              defaultValue: `Câu hỏi ${progressCurrent} trên ${progressTotal}`
            })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: '#1E3A8A' } }}
          />
        </Box>

        <Box flex={1} display="flex" alignItems="center" justifyContent="flex-end" gap={3}>
          {violationCount > 0 && !isCompleted && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <IconAlertTriangle size={18} color="#F59E0B" />
              <Typography variant="body2" fontWeight={600} color="#B45309">
                {violationCount}/{maxViolations}
              </Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <IconClock size={20} color={timeLeft < 60 ? '#EF4444' : '#64748B'} />
            <Typography variant="body1" fontWeight={700} color={timeLeft < 60 ? '#EF4444' : 'text.primary'}>
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* MAIN CONTENT */}
      <Box flex={1} display="flex" justifyContent="center" alignItems={isFinishing ? "center" : "flex-start"} px={{ xs: 2, md: 3, lg: 4 }} py={{ xs: 2, md: 4 }}>
        {timeUpError ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%" gap={2}>
            <Typography variant="h6">{t('assessment.timeUpError', 'Không thể nộp bài khi hết giờ. Vui lòng thử lại.')}</Typography>
            <Button variant="contained" onClick={() => handleTimeUp()}>{t('assessment.retry', 'Thử lại')}</Button>
          </Box>
        ) : isFinishing ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
            <CircularProgress size={60} />
            <Typography mt={3} variant="h6">{t('assessment.processingResult', 'Đang xử lý kết quả...')}</Typography>
          </Box>
        ) : summaryData?.status === 'INTERVIEWING' ? (
          <TestChatRoom assessmentId={assessmentId!} chatMaxTurns={chatMaxTurns} onFinish={handleChatFinish} />
        ) : summaryData ? (
          <TestResultCard summaryData={summaryData} />
        ) : currentQuestion && (
          <TestQuestionCard
            domainName={getLocalizedDomain({
              domainName: currentQuestion.domainName,
            }, t)}
            levelName={getLocalizedLevel({
              targetLevelName: currentQuestion.levelName,
            }, t)}
            content={currentQuestion.content || ''}
            type={currentQuestion.type}
            options={currentQuestion.options || []}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            isLastQuestion={currentQuestion.currentIndex === currentQuestion.totalQuestions}
          />
        )}
      </Box>

      {/* Fullscreen gate: content stays hidden until the candidate goes back to fullscreen */}
      {needsFullscreen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: (theme) => theme.zIndex.modal + 1,
            bgcolor: 'rgba(15, 23, 42, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            px: 3,
            textAlign: 'center',
          }}
        >
          <IconMaximize size={48} color="#FFFFFF" />
          <Typography variant="h5" fontWeight={700} color="#FFFFFF">
            {t('assessment.antiCheat.fullscreenTitle', 'Bài thi yêu cầu chế độ toàn màn hình')}
          </Typography>
          <Typography variant="body1" color="#CBD5E1" maxWidth={520}>
            {t('assessment.antiCheat.fullscreenDesc', {
              max: maxViolations,
              defaultValue: `Trong lúc làm bài, việc chuyển tab, chuyển cửa sổ, thoát toàn màn hình, tải lại hoặc đóng trang sẽ bị ghi nhận là vi phạm. Thời gian vẫn tiếp tục chạy khi bạn rời trang. Vi phạm ${maxViolations} lần, bài thi sẽ tự động được nộp.`,
            })}
          </Typography>
          <Button variant="contained" size="large" onClick={enterFullscreen} startIcon={<IconMaximize size={20} />}>
            {t('assessment.antiCheat.enterFullscreen', 'Vào chế độ toàn màn hình')}
          </Button>
        </Box>
      )}

      <Dialog open={violationWarning !== null && !needsFullscreen} onClose={() => setViolationWarning(null)} maxWidth="xs" fullWidth>
        <DialogTitle display="flex" alignItems="center" gap={1}>
          <IconAlertTriangle size={24} color="#F59E0B" />
          {t('assessment.antiCheat.warningTitle', 'Cảnh báo vi phạm')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('assessment.antiCheat.warningDesc', {
              count: violationWarning ?? 0,
              max: maxViolations,
              defaultValue: `Hệ thống phát hiện bạn đã rời khỏi màn hình làm bài (${violationWarning ?? 0}/${maxViolations}). Nếu đạt ${maxViolations} lần, bài thi sẽ tự động được nộp.`,
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setViolationWarning(null)}>
            {t('assessment.antiCheat.understood', 'Tôi đã hiểu')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
