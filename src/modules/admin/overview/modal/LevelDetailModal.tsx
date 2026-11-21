import React from 'react';
import Link from 'next/link';
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useGetLevelDetail } from '@/apis/overview/hook';
import LevelResultChip from '../components/LevelResultChip';

interface Props {
  /** null = closed; 0 = not even the first level, 1-3 = highest level reached */
  levelId: number | null;
  onClose: () => void;
}

export default function LevelDetailModal({ levelId, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const { data, isLoading } = useGetLevelDetail(levelId);
  const students = data?.result?.students ?? [];

  const levelTitle = levelId === null ? '' : levelId === 0 ? t('level.notReached') : t(`level.name.${levelId}`);

  return (
    <Dialog open={levelId !== null} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {t('levelDetail.title', { level: levelTitle, count: students.length })}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 320 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>{t('levelDetail.empty')}</Typography>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" component="p" mb={1}>
              {t(levelId === 3 ? 'levelDetail.hintTop' : 'levelDetail.hint')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.student')}</TableCell>
                    {[1, 2, 3].map((level) => (
                      <TableCell key={level} align="center">{t(`level.name.${level}`)}</TableCell>
                    ))}
                    <TableCell align="right">{t('table.score')}</TableCell>
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
                      {s.levels.map((result) => (
                        <TableCell key={result.levelId} align="center"><LevelResultChip result={result} /></TableCell>
                      ))}
                      <TableCell align="right">
                        {s.finalScore !== null && s.finalScore !== undefined ? `${Math.round(Number(s.finalScore) * 100) / 100} / 10` : '-'}
                      </TableCell>
                      <TableCell>{s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('vi-VN') : '-'}</TableCell>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
