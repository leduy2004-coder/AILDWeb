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
import { useDeleteQuestion } from '@/apis/question/hook';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  questionId: number | null;
}

export default function ConfirmDeleteModal({ open, onClose, questionId }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });
  const { t: tCommon } = useTranslation('translation', { keyPrefix: 'common.popup_confirm' });

  const deleteMutation = useDeleteQuestion();

  const handleDelete = () => {
    if (!questionId) return;

    deleteMutation.mutate(questionId, {
      onSuccess: () => {
        toast.success(t('confirmDelete.success'));
        onClose();
      },
      onError: () => {
        toast.error(t('confirmDelete.error'));
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{t('confirmDelete.title')}</DialogTitle>
      <DialogContent dividers>
        <Typography>{t('confirmDelete.content')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={deleteMutation.isPending}>
          {tCommon('button.close')}
        </Button>
        <Button
          onClick={handleDelete}
          color="error"
          variant="contained"
          disabled={deleteMutation.isPending}
        >
          {tCommon('button.agree')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
