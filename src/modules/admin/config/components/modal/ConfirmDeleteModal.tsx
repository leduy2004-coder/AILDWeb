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
import { useDeleteDomain, useDeleteLevel } from '@/apis/config/hook';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  deleteId: number | null;
  type: 'domain' | 'level';
}

export default function ConfirmDeleteModal({ open, onClose, deleteId, type }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });
  const { t: tCommon } = useTranslation('translation', { keyPrefix: 'common.popup_confirm' });

  const deleteDomainMutation = useDeleteDomain();
  const deleteLevelMutation = useDeleteLevel();

  const isPending = deleteDomainMutation.isPending || deleteLevelMutation.isPending;

  const handleDelete = () => {
    if (!deleteId) return;

    if (type === 'domain') {
      deleteDomainMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success(t('toast.deleteSuccess'));
          onClose();
        },
        onError: () => {
          toast.error(t('toast.error'));
        },
      });
    } else {
      deleteLevelMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success(t('toast.deleteSuccess'));
          onClose();
        },
        onError: () => {
          toast.error(t('toast.error'));
        },
      });
    }
  };

  const title = type === 'domain' ? t('domains.delete') : t('levels.delete');
  const content = type === 'domain' ? t('domains.confirmDelete') : t('levels.confirmDelete');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isPending}>
          {tCommon('button.close')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={isPending}
        >
          {tCommon('button.agree')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
