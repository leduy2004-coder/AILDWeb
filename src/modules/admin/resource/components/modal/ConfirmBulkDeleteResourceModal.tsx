import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useBulkDeleteResource } from '@/apis/resource/hook/useBulkDeleteResource';

interface Props {
  open: boolean;
  onClose: () => void;
  selectedIds: number[];
  onSuccess?: () => void;
}

export default function ConfirmBulkDeleteResourceModal({ open, onClose, selectedIds, onSuccess }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource' });
  const { t: tCommon } = useTranslation('translation', { keyPrefix: 'common.popup_confirm' });

  const bulkDeleteMutation = useBulkDeleteResource();

  const handleDelete = () => {
    if (selectedIds.length === 0) return;

    bulkDeleteMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(t('delete.success'));
        onSuccess?.();
        onClose();
      },
      onError: () => {
        toast.error(t('delete.error'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('delete.title')}</DialogTitle>
      <DialogContent dividers>
        <Typography>Bạn có chắc chắn muốn xóa {selectedIds.length} tài nguyên đã chọn?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={bulkDeleteMutation.isPending}>
          {tCommon('button.close')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={bulkDeleteMutation.isPending}
        >
          {tCommon('button.agree')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
