import React from 'react';
import { Box, Typography, Paper, Chip, Divider, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IAdminAssessmentAnswerDto } from '@/types/admin/assessment.type';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface SubmissionDetailAnswersProps {
  answers: IAdminAssessmentAnswerDto[];
}

export default function SubmissionDetailAnswers({ answers }: SubmissionDetailAnswersProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mt: 4, mb: 2 }}>
        {t('detail.answersTitle', 'Chi tiết các câu hỏi')}
      </Typography>

      {answers.map((answer, index) => {
        const isMultipleChoice = answer.questionType === 'MULTIPLE_CHOICE';

        return (
          <Card key={answer.id} sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" fontWeight={600}>
                  {t('detail.questionNumber', 'Câu {{num}}', { num: index + 1 })}
                </Typography>
                <Chip
                  label={answer.isCorrect ? t('detail.correct', 'Đúng') : t('detail.incorrect', 'Sai')}
                  color={answer.isCorrect ? 'success' : 'error'}
                  icon={answer.isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" mb={3} dangerouslySetInnerHTML={{ __html: answer.questionContent }} />

              {isMultipleChoice ? (
                <Box display="flex" flexDirection="column" gap={1.5}>
                  {answer.options.map((option) => {
                    const isSelected = answer.selectedOptionId === option.id;
                    const isCorrectOption = option.isCorrect;
                    
                    let bgColor = 'transparent';
                    let borderColor = 'divider';
                    
                    if (isCorrectOption) {
                      bgColor = 'rgba(46, 125, 50, 0.1)';
                      borderColor = 'success.main';
                    } else if (isSelected && !isCorrectOption) {
                      bgColor = 'rgba(211, 47, 47, 0.1)';
                      borderColor = 'error.main';
                    }

                    return (
                      <Paper
                        key={option.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: bgColor,
                          borderColor: borderColor,
                          borderWidth: isSelected || isCorrectOption ? 2 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Typography flex={1}>{option.content}</Typography>
                        {isSelected && (
                          <Chip size="small" label={t('detail.selected', 'Sinh viên chọn')} color="primary" />
                        )}
                        {isCorrectOption && (
                          <Chip size="small" label={t('detail.correctAnswer', 'Đáp án đúng')} color="success" />
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {t('detail.studentAnswerText', 'Câu trả lời của sinh viên:')}
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 3 }} variant="outlined">
                    <Typography>{answer.answerText || t('detail.noAnswer', '(Không có câu trả lời)')}</Typography>
                  </Paper>

                  {answer.rubric && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {t('detail.rubric', 'Tiêu chí chấm / Đáp án đúng:')}
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', mb: 3 }} variant="outlined">
                        <Typography dangerouslySetInnerHTML={{ __html: answer.rubric }} />
                      </Paper>
                    </>
                  )}

                  <Box 
                    sx={{ 
                      p: 2.5, 
                      bgcolor: 'rgba(156, 39, 176, 0.05)', 
                      border: '1px solid',
                      borderColor: 'secondary.light',
                      borderRadius: 2 
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AutoAwesomeIcon color="secondary" />
                      <Typography variant="subtitle1" fontWeight={600} color="secondary.main">
                        {t('detail.aiFeedback', 'AI Chấm điểm & Nhận xét')}
                      </Typography>
                    </Box>
                    <Typography variant="body1" mb={1}>
                      <strong>{t('detail.score', 'Điểm:')}</strong> {answer.aiScore ?? '-'} / 10
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {answer.aiJustification || t('detail.noAIFeedback', '(Không có nhận xét từ AI)')}
                    </Typography>
                  </Box>
                </Box>
              )}

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
