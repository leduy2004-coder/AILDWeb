import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tabs, Tooltip, Typography,
} from '@mui/material';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useGetDomainDetail } from '@/apis/overview/hook';
import LevelResultChip from '../components/LevelResultChip';

interface Props {
  /** null = closed */
  domainId: number | null;
  onClose: () => void;
}

/** Below this a student is flagged as needing support in the domain, same mark as a skill node */
const PASS_PERCENT = 50;

const scoreColor = (percent: number): 'error' | 'warning' | 'success' =>
  percent < PASS_PERCENT ? 'error' : percent < 80 ? 'warning' : 'success';

export default function DomainDetailModal({ domainId, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const [tab, setTab] = useState<'students' | 'questions'>('students');
  const { data, isLoading } = useGetDomainDetail(domainId);

  const students = data?.result?.students ?? [];
  const questions = data?.result?.questions ?? [];
  const average = students.length ? students.reduce((sum, s) => sum + Number(s.score), 0) / students.length : 0;
  const belowPass = students.filter((s) => Number(s.score) < PASS_PERCENT).length;
  // Questions answered per level across all students: shows how rarely the adaptive test goes up in this domain
  const answeredByLevel = [1, 2, 3].map((level) =>
    students.reduce((sum, s) => sum + (s.levels?.find((r) => r.levelId === level)?.answered ?? 0), 0)
  );

  const handleClose = () => {
    setTab('students');
    onClose();
  };

  return (
    <Dialog open={domainId !== null} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {domainId !== null ? t(`domain.name.${domainId}`) : ''}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>

      <Box px={3}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab value="students" label={t('domainDetail.tabStudents', { count: students.length })} />
          <Tab value="questions" label={t('domainDetail.tabQuestions', { count: questions.length })} />
        </Tabs>
      </Box>

      <DialogContent dividers sx={{ minHeight: 360 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : tab === 'students' ? (
          students.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>{t('domainDetail.noStudents')}</Typography>
          ) : (
            <>
              <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                <Chip label={t('domainDetail.average', { value: Math.round(average) })} color={scoreColor(average)} variant="outlined" />
                <Chip label={t('domainDetail.belowPass', { count: belowPass, total: students.length })} color={belowPass ? 'error' : 'default'} variant="outlined" />
                <Chip
                  variant="outlined"
                  label={t('domainDetail.answeredByLevel', {
                    understand: answeredByLevel[0],
                    apply: answeredByLevel[1],
                    create: answeredByLevel[2],
                  })}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" component="p" mb={1}>
                {t('domainDetail.studentsHint')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('table.student')}</TableCell>
                      <TableCell align="right">{t('domainDetail.domainScore')}</TableCell>
                      <TableCell>{t('domainDetail.byLevel')}</TableCell>
                      <TableCell>{t('table.date')}</TableCell>
                      <TableCell align="right" />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => (
                      <TableRow key={s.studentId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{s.studentName}</Typography>
                          {s.studentEmail && <Typography variant="caption" color="text.secondary">{s.studentEmail}</Typography>}
                        </TableCell>
                        <TableCell align="right">
                          <Chip size="small" label={`${Math.round(Number(s.score))}%`} color={scoreColor(Number(s.score))} />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap" alignItems="center">
                            {(s.levels ?? []).map((result) => (
                              <LevelResultChip key={result.levelId} result={result} showLevel />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('vi-VN') : '-'}
                        </TableCell>
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
            </>
          )
        ) : questions.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>{t('domainDetail.noQuestions')}</Typography>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" component="p" mb={1}>
              {t('domainDetail.questionsHint')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('domainDetail.question')}</TableCell>
                    <TableCell>{t('domainDetail.level')}</TableCell>
                    <TableCell align="right">{t('domainDetail.attempts')}</TableCell>
                    <TableCell sx={{ minWidth: 160 }}>{t('domainDetail.correctRate')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((q) => (
                    <TableRow key={q.questionId} hover>
                      <TableCell sx={{ maxWidth: 380 }}>
                        <Tooltip title={q.content}>
                          <Typography
                            variant="body2"
                            sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {q.content}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{t(`level.name.${q.levelId}`)}</TableCell>
                      <TableCell align="right">{q.attempts}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LinearProgress
                            variant="determinate"
                            value={q.correctRate}
                            color={scoreColor(q.correctRate)}
                            sx={{ flex: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2" fontWeight={600} minWidth={40} textAlign="right">
                            {Math.round(q.correctRate)}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
