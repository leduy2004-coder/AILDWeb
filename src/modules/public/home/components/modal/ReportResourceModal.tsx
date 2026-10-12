import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, IconButton } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useReportResource } from '@/apis/student/hook';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  resourceId: number;
  resourceTitle: string;
  onReportSuccess?: () => void;
}

export default function ReportResourceModal({ open, onClose, resourceId, resourceTitle, onReportSuccess }: Props) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const { mutate, isPending } = useReportResource();

  const handleSubmit = () => {
    if (!reason.trim()) {
      toast.error(t('report_resource.error.empty_reason', 'Vui lòng nhập lý do báo cáo'));
      return;
    }
    
    mutate({ resourceId, reason }, {
      onSuccess: () => {
        toast.success(t('report_resource.success', 'Báo cáo thành công. Cảm ơn bạn đã phản hồi!'));
        setReason('');
        onReportSuccess?.();
        onClose();
      },
      onError: () => {
        toast.error(t('report_resource.error.submit_failed', 'Có lỗi xảy ra, vui lòng thử lại sau.'));
      }
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{t('report_resource.title', 'Báo cáo tài nguyên')}</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {t('report_resource.description', 'Bạn đang báo cáo tài liệu: ')}
          <strong>{resourceTitle}</strong>.{' '}
          {t('report_resource.instruction', 'Vui lòng cho quản trị viên biết tài liệu này gặp vấn đề gì (ví dụ: link hỏng, nội dung sai, v.v.).')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder={t('report_resource.placeholder', 'Nhập lý do báo cáo...')}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t('common.cancel', 'Hủy')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="error" disabled={isPending || !reason.trim()}>
          {t('report_resource.submit', 'Gửi Báo Cáo')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
