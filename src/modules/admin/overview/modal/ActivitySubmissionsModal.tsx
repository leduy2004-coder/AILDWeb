import React from 'react';
import Link from 'next/link';
import {
  Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IActivityPeriod, useGetActivitySubmissions } from '@/apis/overview/hook';

interface Props {
  /** null = closed */
  period: IActivityPeriod | null;
  onClose: () => void;
}

const formatScore = (value?: number | null) => (value === null || value === undefined ? '-' : Number(value).toFixed(1));

/** Assessments completed in the clicked bar of the activity chart (a month or a day), newest first. */
export default function ActivitySubmissionsModal({ period, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const { data, isLoading } = useGetActivitySubmissions(period);
  const submissions = data?.result ?? [];

  const title = !period
    ? ''
    : period.day
      ? t('activity.submissionsOfDay', { day: period.day, month: period.month, year: period.year, count: submissions.length })
      : t('activity.submissionsOfMonth', { month: period.month, year: period.year, count: submissions.length });

  return (
    <Dialog open={period !== null} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ minHeight: 320 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : submissions.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>{t('activity.noSubmissions')}</Typography>
        ) : (
          <TableContainer>
            <Table size="small" sx={{ minWidth: 640 }}>
              <TableHead>
                <TableRow>
                  <TableCell>{t('table.student')}</TableCell>
                  <TableCell align="right">{t('scoreParts.mcq')}</TableCell>
                  <TableCell align="right">{t('scoreParts.interview')}</TableCell>
                  <TableCell align="right">{t('table.score')}</TableCell>
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
                    <TableCell align="right">{formatScore(s.mcqScore)}</TableCell>
                    <TableCell align="right">{formatScore(s.interviewScore)}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>{formatScore(s.finalScore)}</Typography>
                    </TableCell>
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
      </DialogContent>
    </Dialog>
  );
}
