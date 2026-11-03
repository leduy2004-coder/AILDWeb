import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography, Box, TablePagination, Tooltip } from '@mui/material';
import { IconEye, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ISourceDocument } from '@/types/admin/source-document.type';
import { DOCUMENT_STATUS_COLOR } from '../../constant/source-document.constant';

interface DocumentTableProps {
  data: ISourceDocument[];
  onView: (doc: ISourceDocument) => void;
  onReprocess: (doc: ISourceDocument) => void;
  onDelete: (doc: ISourceDocument) => void;
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '-';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function DocumentTable({ data, onView, onReprocess, onDelete, totalElements, page, size, onPageChange }: DocumentTableProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell width="35%"><Typography variant="subtitle2" fontWeight={600}>{t('table.title')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.status')}</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle2" fontWeight={600}>{t('table.pages')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.chunks')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.createdDate')}</Typography></TableCell>
            <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>{t('table.action')}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">{t('table.empty')}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const busy = row.status === 'PENDING' || row.status === 'PROCESSING';
              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{row.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[row.sourceName, row.publishedYear, row.fileName].filter(Boolean).join(' · ')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={row.status === 'FAILED' ? row.errorMessage || '' : ''}>
                      <Chip label={t(`status.${row.status}`)} size="small" color={DOCUMENT_STATUS_COLOR[row.status]} />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{row.pageCount ?? '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      <Chip size="small" variant="outlined" color="success" label={t('table.activeCount', { count: row.activeChunkCount })} />
                      {row.unlabeledChunkCount > 0 && (
                        <Chip size="small" variant="outlined" color="warning" label={t('table.unlabeledCount', { count: row.unlabeledChunkCount })} />
                      )}
                      {row.ignoredChunkCount > 0 && (
                        <Chip size="small" variant="outlined" label={t('table.ignoredCount', { count: row.ignoredChunkCount })} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(row.createdDate)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="info" onClick={() => onView(row)} title={t('table.actionView')}>
                      <IconEye size={18} />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => onReprocess(row)} disabled={busy} title={t('table.actionReprocess')}>
                      <IconRefresh size={18} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(row)} disabled={busy} title={t('table.actionDelete')}>
                      <IconTrash size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
      />
    </TableContainer>
  );
}
