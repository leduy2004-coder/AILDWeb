import React from 'react';
import Link from 'next/link';
import {
  Box, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useGetImprovementList } from '@/apis/overview/hook';

interface Props {
  open: boolean;
  onClose: () => void;
}

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString('vi-VN') : '-');
const formatScore = (value?: number | null) => (value === null || value === undefined ? '-' : Number(value).toFixed(2));

/** Students who retook the assessment, biggest drop first. */
export default function ImprovementModal({ open, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const { data, isLoading } = useGetImprovementList(open);
  const students = data?.result ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {t('improvement.listTitle', { count: students.length })}
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
          <Typography color="text.secondary" textAlign="center" py={4}>{t('improvement.empty')}</Typography>
        ) : (
          <>
            <Typography variant="caption" color="text.secondary" component="p" mb={1}>
              {t('improvement.listHint')}
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('table.student')}</TableCell>
                    <TableCell align="center">{t('improvement.attempts')}</TableCell>
                    <TableCell align="right">{t('improvement.firstScore')}</TableCell>
                    <TableCell align="right">{t('improvement.latestScore')}</TableCell>
                    <TableCell align="right">{t('improvement.change')}</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((s) => {
                    const delta = Number(s.delta);
                    return (
                      <TableRow key={s.studentId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{s.studentName}</Typography>
                          {s.studentEmail && <Typography variant="caption" color="text.secondary">{s.studentEmail}</Typography>}
                        </TableCell>
                        <TableCell align="center">{s.attempts}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{formatScore(s.firstScore)}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(s.firstSubmittedAt)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{formatScore(s.latestScore)}</Typography>
                          <Typography variant="caption" color="text.secondary">{formatDate(s.latestSubmittedAt)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            color={delta > 0 ? 'success' : delta < 0 ? 'error' : 'default'}
                            label={`${delta > 0 ? '+' : ''}${delta.toFixed(2)}`}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={t('improvement.openLatest')}>
                            <IconButton size="small" component={Link} href={`/admin/submissions/${s.latestAssessmentId}`}>
                              <IconExternalLink size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
