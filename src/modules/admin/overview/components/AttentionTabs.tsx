import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box, Card, CardContent, Chip, CircularProgress, IconButton, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tabs, Tooltip, Typography, useTheme,
} from '@mui/material';
import { IconEdit, IconExternalLink } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useGetAttention } from '@/apis/overview/hook';
import { IAssessmentStatus, ReviewReason } from '@/types/admin/overview.type';

interface Props {
  /** How all completed assessments ended, shown above the review list */
  status?: IAssessmentStatus;
  completedAssessments?: number;
}

const REASON_COLOR: Record<ReviewReason, 'error' | 'warning' | 'info' | 'default'> = {
  FORCED_BY_VIOLATIONS: 'error',
  VIOLATIONS: 'warning',
  SCORE_GAP: 'info',
  TIMED_OUT: 'default',
};

const formatScore = (value?: number | null) => (value === null || value === undefined ? '-' : Number(value).toFixed(1));

/** What the admin should look at: suspicious submissions to review, and questions with an unusual correct rate. */
export const AttentionTabs = ({ status, completedAssessments = 0 }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();
  const [tab, setTab] = useState<'submissions' | 'questions'>('submissions');
  const { data, isLoading } = useGetAttention();

  const attention = data?.result;
  const submissions = attention?.submissions ?? [];
  const questions = attention?.questions ?? [];

  const withPercent = (count: number) =>
    completedAssessments ? `${count} (${Math.round((count * 100) / completedAssessments)}%)` : `${count}`;
  // All-time figures, unlike the list below which only covers the last days
  const stats: { label: string; value: string; color?: string }[] = status
    ? [
        { label: t('assessmentStatus.active'), value: `${status.activeAssessments}` },
        { label: t('assessmentStatus.timedOut'), value: withPercent(status.timedOutAssessments), color: status.timedOutAssessments ? 'warning.main' : undefined },
        { label: t('assessmentStatus.withViolations'), value: withPercent(status.withViolations), color: status.withViolations ? 'warning.main' : undefined },
        { label: t('assessmentStatus.forcedByViolations'), value: withPercent(status.forcedByViolations), color: status.forcedByViolations ? 'error.main' : undefined },
      ]
    : [];

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Typography variant="h6" fontWeight={600} mb={1}>
          {t('attention.title')}
        </Typography>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
          <Tab value="submissions" label={t('attention.tabSubmissions', { count: submissions.length })} />
          <Tab value="questions" label={t('attention.tabQuestions', { count: questions.length })} />
        </Tabs>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : tab === 'submissions' ? (
          <>
            {stats.length > 0 && (
              // One inline line: "All 85 completed: In progress 3 · Timed out 7 (8%) · ..."
              <Typography variant="body2" color="text.secondary" component="div" mb={1.5}>
                {t('attention.allTimeStats', { count: completedAssessments })}{' '}
                {stats.map((stat, index) => (
                  <React.Fragment key={stat.label}>
                    {index > 0 && <Box component="span" mx={1}>·</Box>}
                    {stat.label}{' '}
                    <Box component="span" fontWeight={700} color={stat.color ?? 'text.primary'}>{stat.value}</Box>
                  </React.Fragment>
                ))}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" component="p" mb={1}>
              {t('attention.submissionsHint', { days: attention?.reviewWindowDays ?? 30 })}
            </Typography>
            {submissions.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>{t('attention.noSubmissions')}</Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table size="small" stickyHeader sx={{ minWidth: 640 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('table.student')}</TableCell>
                      <TableCell>{t('attention.reason')}</TableCell>
                      <TableCell align="right">{t('scoreParts.mcq')}</TableCell>
                      <TableCell align="right">{t('scoreParts.interview')}</TableCell>
                      <TableCell>{t('attention.submittedAt')}</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {submissions.map((s) => (
                      <TableRow key={s.assessmentId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{s.studentName}</Typography>
                          {s.studentEmail && <Typography variant="caption" color="text.secondary">{s.studentEmail}</Typography>}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {s.reasons.map((reason) => (
                              <Chip
                                key={reason}
                                size="small"
                                color={REASON_COLOR[reason]}
                                variant={reason === 'TIMED_OUT' ? 'outlined' : 'filled'}
                                label={t(`attention.reasons.${reason}`, { count: s.violationCount })}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatScore(s.mcqScore)}</TableCell>
                        <TableCell align="right">{formatScore(s.interviewScore)}</TableCell>
                        <TableCell>{s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi-VN') : '-'}</TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('domainDetail.openSubmission')}>
                            <IconButton size="small" component={Link} href={`/admin/submissions/${s.assessmentId}`}>
                              <IconExternalLink size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" component="p" mb={1}>
              {t('attention.questionsHint', { min: attention?.minAttempts ?? 5 })}
            </Typography>
            {questions.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>{t('attention.noQuestions')}</Typography>
            ) : (
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table size="small" stickyHeader sx={{ minWidth: 640 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('domainDetail.question')}</TableCell>
                      <TableCell>{t('attention.domain')}</TableCell>
                      <TableCell>{t('domainDetail.level')}</TableCell>
                      <TableCell align="right">{t('domainDetail.attempts')}</TableCell>
                      <TableCell>{t('domainDetail.correctRate')}</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.map((q) => (
                      <TableRow key={q.questionId} hover>
                        <TableCell sx={{ maxWidth: 360 }}>
                          <Tooltip title={q.content}>
                            <Typography
                              variant="body2"
                              sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                            >
                              {q.content}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{t(`domain.name.${q.domainId}`)}</TableCell>
                        <TableCell>{t(`level.name.${q.levelId}`)}</TableCell>
                        <TableCell align="right">{q.attempts}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            color={q.kind === 'TOO_HARD' ? 'error' : 'info'}
                            label={t(`attention.kinds.${q.kind}`, { rate: Math.round(q.correctRate) })}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('attention.editQuestion')}>
                            <IconButton size="small" component={Link} href={`/admin/questions?edit=${q.questionId}`}>
                              <IconEdit size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
