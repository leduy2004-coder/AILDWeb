import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  placeholder: string;
  name: string;
  control: any;
}

export default function ExpandFieldModal({ open, onClose, title, placeholder, name, control }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question.form' });
  const { field } = useController({ name, control });
  
  const [localValue, setLocalValue] = useState(field.value || '');

  useEffect(() => {
    if (open) {
      setLocalValue(field.value || '');
    }
  }, [open, field.value]);

  const handleSave = () => {
    field.onChange(localValue);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ zIndex: 1500 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          multiline
          minRows={20}
          placeholder={placeholder}
          autoFocus
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('cancel')}
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t('saveButton')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
