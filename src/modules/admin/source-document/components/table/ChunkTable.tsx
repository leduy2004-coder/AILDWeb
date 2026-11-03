import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box, Checkbox, TablePagination } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ISourceChunk } from '@/types/admin/source-document.type';
import { QUESTION_DOMAIN_COLOR } from '@/modules/admin/question/constant/question.constant';
import { CHUNK_STATUS_COLOR, LOW_CONFIDENCE } from '../../constant/source-document.constant';

interface Props {
  data: ISourceChunk[];
  onPreview: (chunk: ISourceChunk) => void;
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
  selectedIds: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: number) => void;
}

export const formatPages = (from?: number, to?: number) => {
  if (!from) return '-';
  return to && to !== from ? `${from}-${to}` : `${from}`;
};

export default function ChunkTable({ data, onPreview, totalElements, page, size, onPageChange, selectedIds, onSelectAll, onSelectOne }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                checked={data.length > 0 && selectedIds.length === data.length}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('chunkTable.page')}</Typography></TableCell>
            <TableCell width="45%"><Typography variant="subtitle2" fontWeight={600}>{t('chunkTable.content')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('chunkTable.label')}</Typography></TableCell>
            <TableCell align="center"><Typography variant="subtitle2" fontWeight={600}>{t('chunkTable.confidence')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('chunkTable.status')}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">{t('chunkTable.empty')}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const isSelected = selectedIds.includes(row.id);
              const lowConfidence = row.suggestConfidence !== undefined && row.suggestConfidence !== null && row.suggestConfidence < LOW_CONFIDENCE;
              return (
                <TableRow key={row.id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox color="primary" checked={isSelected} onChange={() => onSelectOne(row.id)} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatPages(row.pageFrom, row.pageTo)}</Typography>
                  </TableCell>
                  <TableCell onClick={() => onPreview(row)} sx={{ cursor: 'pointer' }}>
                    <Typography
                      variant="body2"
                      sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {row.content}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {row.domainId ? (
                      <Box display="flex" flexDirection="column" gap={0.5} alignItems="flex-start">
                        <Chip size="small" variant="outlined" color={QUESTION_DOMAIN_COLOR[row.domainId] || 'default'} label={tDomain(row.domainId.toString())} />
                        <Typography variant="caption">{t(`labelSource.${row.labelSource || 'AUTO'}`)}</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">{t('chunkTable.noLabel')}</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color={lowConfidence ? 'warning.main' : 'text.primary'} fontWeight={lowConfidence ? 600 : 400}>
                      {row.suggestConfidence !== undefined && row.suggestConfidence !== null ? Number(row.suggestConfidence).toFixed(2) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" color={CHUNK_STATUS_COLOR[row.status]} label={t(`chunkStatus.${row.status}`)} />
                    {row.ignoreReason && (
                      <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                        {t(`ignoreReason.${row.ignoreReason}`)}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
      />
    </TableContainer>
  );
}
