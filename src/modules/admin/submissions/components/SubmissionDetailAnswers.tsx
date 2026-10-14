import React from 'react';
import { Box, Typography, Paper, Chip, Card, CardContent } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IAdminAssessmentAnswerDto } from '@/types/admin/assessment.type';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

              <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                {answer.domainName && (
                  <Chip size="small" label={`${t('detail.tagDomain', 'Miền')}: ${answer.domainName}`} color="primary" variant="outlined" sx={{ borderRadius: '2px' }} />
                )}
                {answer.levelName && (
                  <Chip size="small" label={`${t('detail.tagLevel', 'Mức độ')}: ${answer.levelName}`} color="secondary" variant="outlined" sx={{ borderRadius: '2px' }} />
                )}
                {answer.difficultyIndex !== null && answer.difficultyIndex !== undefined && (
                  <Chip size="small" label={`${t('detail.tagDifficulty', 'Độ khó')}: ${answer.difficultyIndex}`} color="info" variant="outlined" sx={{ borderRadius: '2px' }} />
                )}
              </Box>

              <Typography variant="body1" mb={3} dangerouslySetInnerHTML={{ __html: answer.questionContent }} />

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

            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
