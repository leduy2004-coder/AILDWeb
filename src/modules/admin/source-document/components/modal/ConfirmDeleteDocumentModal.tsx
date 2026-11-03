import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export default function ConfirmDeleteDocumentModal({ open, onClose, onConfirm, title, loading }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document.delete' });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{t('title')}</Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" mb={2}>{t('content')}</Typography>
        <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1, color: 'error.main', fontWeight: 500 }}>
          {title}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t('cancel')}</Button>
        <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>{t('confirm')}</Button>
      </DialogActions>
    </Dialog>
  );
}
