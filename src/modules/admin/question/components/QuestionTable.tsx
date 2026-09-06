import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TablePagination,
  Box,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { IQuestion } from '@/types/admin/question.type';
import { QUESTION_DOMAIN_COLOR, QUESTION_STATUS_COLOR } from '@/modules/admin/question/constant/question.constant';

interface Props {
  data: IQuestion[];
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function QuestionTable({
  data,
  totalElements,
  page,
  size,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const { t: tLevel } = useTranslation('translation', { keyPrefix: 'admin_overview.level.name' });

  const getStatusColor = (status: string) => QUESTION_STATUS_COLOR[status] || 'default';
  const getDomainColor = (domainId: number) => QUESTION_DOMAIN_COLOR[domainId] || 'default';

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1 }} elevation={0} variant="outlined">
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell width="30%"><Typography variant="subtitle2" fontWeight={600}>{t('table.question')}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.domain')}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.level')}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.type')}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.difficultyIndex', { defaultValue: 'Độ khó' })}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.updatedAt', { defaultValue: 'Ngày cập nhật' })}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.status')}</Typography></TableCell>
              <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>{t('table.action')}</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    {t('noData', { defaultValue: 'Không có dữ liệu' })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {row.content}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={tDomain(row.domainId.toString())} size="small" color={getDomainColor(row.domainId)} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={tLevel(row.levelId.toString())} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{t(`types.${row.type}`)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.difficultyIndex ?? '-'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('vi-VN') : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`status.${row.status}`)}
                      size="small"
                      color={getStatusColor(row.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <IconButton size="small" color="primary" onClick={() => onEdit(row.id)}>
                        <Icon icon="solar:pen-bold-duotone" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDelete(row.id)}>
                        <Icon icon="solar:trash-bin-trash-bold-duotone" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={page}
        onPageChange={(e, newPage) => onPageChange(newPage)}
      />
      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="caption" color="textSecondary" fontStyle="italic">
          {t('table.difficultyNote')}
        </Typography>
      </Box>
    </Paper>
  );
}
