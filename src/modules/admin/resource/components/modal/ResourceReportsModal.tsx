import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { IconX, IconFlag, IconTrash } from '@tabler/icons-react';
import { IResource } from '@/types/admin/resource.type';
import { useGetResourceReports } from '@/apis/resource/hook/useGetResourceReports';
import { useDeleteResourceReport } from '@/apis/resource/hook/useDeleteResourceReport';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ConfirmDeleteReportModal from './ConfirmDeleteReportModal';

interface Props {
  open: boolean;
  onClose: () => void;
  resource: IResource | null;
}

export default function ResourceReportsModal({ open, onClose, resource }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.reportsModal' });
  const { data, isLoading } = useGetResourceReports(resource?.id || 0, !!resource?.id && open);
  const deleteMutation = useDeleteResourceReport(resource?.id || 0);

  const [reportToDelete, setReportToDelete] = React.useState<number | null>(null);

  const handleDelete = () => {
    if (reportToDelete) {
      deleteMutation.mutate(reportToDelete, {
        onSuccess: () => {
          toast.success(t('deleteSuccess', 'Đã xóa báo cáo thành công'));
          setReportToDelete(null);
        },
        onError: () => {
          toast.error(t('deleteError', 'Có lỗi xảy ra khi xóa báo cáo'));
        }
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconFlag size={24} color="#EF4444" />
          <Typography variant="h6">
            {t('title', { title: resource?.title, defaultValue: `Lượt báo cáo: ${resource?.title}` })}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {isLoading ? (
          <Box p={3} textAlign="center">{t('loading', 'Đang tải...')}</Box>
        ) : data?.result?.length === 0 ? (
          <Box p={3} textAlign="center" color="text.secondary">
            {t('empty', 'Không có báo cáo nào.')}
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell>{t('table.user', 'Người dùng')}</TableCell>
                  <TableCell>{t('table.email', 'Email')}</TableCell>
                  <TableCell>{t('table.reason', 'Lý do')}</TableCell>
                  <TableCell>{t('table.reportedAt', 'Ngày báo cáo')}</TableCell>
                  <TableCell align="right">{t('table.action', 'Hành động')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.result?.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.name}</TableCell>
                    <TableCell>{report.email}</TableCell>
                    <TableCell sx={{ maxWidth: 300, wordWrap: 'break-word' }}>{report.reason}</TableCell>
                    <TableCell>{new Date(report.reportedAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => setReportToDelete(report.id)}
                        disabled={deleteMutation.isPending}
                        title={t('deleteTitle', 'Xóa/Gỡ báo cáo')}
                      >
                        <IconTrash size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <ConfirmDeleteReportModal
        open={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </Dialog>
  );
}
