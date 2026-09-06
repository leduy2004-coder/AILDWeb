import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmCloseDialog({ open, onClose, onConfirm }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question.form' });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ zIndex: 1400 }}>
      <DialogTitle>{t('confirmClose.title')}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          {t('confirmClose.content')}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">{t('confirmClose.cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {t('confirmClose.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
