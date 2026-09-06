import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Stack, TextField, DialogActions, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  onGenerate: (appArea: string, notes: string) => void;
}

export default function AIGenerateDialog({ open, onClose, onGenerate }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });
  const [appArea, setAppArea] = useState('');
  const [notes, setNotes] = useState('');

  const handleGenerate = () => {
    onGenerate(appArea, notes);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('ai.dialogTitle')}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" mb={2}>
          {t('ai.dialogDescription')}
        </Typography>
        <Stack spacing={2}>
          <TextField 
            label={t('ai.applicationArea')} 
            fullWidth 
            size="small" 
            value={appArea}
            onChange={(e) => setAppArea(e.target.value)}
            placeholder={t('ai.applicationAreaPlaceholder')}
          />
          <TextField 
            label={t('ai.notes')} 
            fullWidth 
            multiline 
            rows={3} 
            size="small" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('ai.notesPlaceholder')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">{t('ai.cancel')}</Button>
        <Button onClick={handleGenerate} variant="contained" color="secondary" startIcon={<Icon icon="solar:magic-stick-3-bold-duotone" />}>
          {t('ai.startGenerate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
