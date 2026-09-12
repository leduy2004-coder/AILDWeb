import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface ConfirmBulkDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export default function ConfirmBulkDeleteModal({
  open,
  onClose,
  onConfirm,
  count,
}: ConfirmBulkDeleteModalProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="error" />
        {t('delete.bulkTitle', 'Xác nhận xóa nhiều bài làm')}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Typography>
            {t(
              'delete.bulkConfirm',
              'Bạn có chắc chắn muốn xóa {{count}} bài làm này? Hành động này không thể hoàn tác.',
              { count }
            )}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('action.cancel', 'Hủy')}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {t('action.delete', 'Xóa')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
