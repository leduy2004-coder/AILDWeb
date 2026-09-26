import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function ConfirmDeleteReportModal({ open, onClose, onConfirm, isLoading }: Props) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{t('admin_resource.reportsModal.deleteTitle', 'Xóa/Gỡ báo cáo')}</Typography>
        <IconButton onClick={onClose} size="small" disabled={isLoading}>
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" mb={2}>
          {t('admin_resource.reportsModal.deleteConfirm', 'Bạn có chắc chắn muốn xóa/gỡ báo cáo này?')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isLoading}>
          {t('admin_resource.delete.cancel', 'Hủy')}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={isLoading}>
          {t('admin_resource.delete.confirm', 'Xóa')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
