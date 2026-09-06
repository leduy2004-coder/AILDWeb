import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export default function ConfirmBulkDeleteUserModal({ open, onClose, onConfirm, count }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_user.delete' });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{t('bulkTitle')}</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">
          {t('bulkContent', { count })}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
