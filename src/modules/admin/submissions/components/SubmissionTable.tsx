import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  TablePagination,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from 'dayjs';
import { IAdminAssessmentListDto } from '@/types/admin/assessment.type';
import { useRouter } from 'next/navigation';

interface SubmissionTableProps {
  data: IAdminAssessmentListDto[];
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
  selectedIds: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

export default function SubmissionTable({
  data,
  totalElements,
  page,
  size,
  onPageChange,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: SubmissionTableProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });
  const router = useRouter();

  const totalPages = Math.ceil(totalElements / size);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'warning';
      case 'SUBMITTED':
        return 'info';
      case 'REVIEWED':
        return 'secondary';
      case 'COMPLETED':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1 }} elevation={0} variant="outlined">
      <TableContainer>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={onSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('table.student', 'Sinh viên')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('table.startedAt', 'Bắt đầu lúc')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('table.finalScore', 'Điểm')}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{t('table.status', 'Trạng thái')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                {t('table.actions', 'Thao tác')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">
                    {t('table.noData', 'Không có dữ liệu')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  hover
                  key={row.id}
                  selected={selectedIds.indexOf(row.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.indexOf(row.id) !== -1}
                      onChange={(e) => onSelectOne(e, row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {row.studentName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.studentEmail}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {dayjs(row.startedAt).format('DD/MM/YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {row.finalScore !== null && row.finalScore !== undefined ? (
                      <Typography variant="body2" fontWeight={600} color="primary.main">
                        {row.finalScore.toFixed(1)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`status.${row.status}`, row.status)}
                      color={getStatusColor(row.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/admin/submissions/${row.id}`)}
                      title={t('action.view', 'Xem chi tiết')}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>



      <TablePagination
        rowsPerPageOptions={[size]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={Math.max(0, page - 1)}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
      />
    </Paper>
  );
}
