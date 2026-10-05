import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { LevelFormValues, getLevelSchema } from '../../schema/config.schema';

interface LevelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LevelFormValues) => void;
  isLoading?: boolean;
}

const LevelModal: React.FC<LevelModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LevelFormValues>({
    resolver: zodResolver(getLevelSchema(t)) as any,
    defaultValues: {
      code: '',
      name: '',
      displayOrder: 1,
    },
  });

  React.useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('modal.addLevel')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('levels.code')}
                  fullWidth
                  error={!!errors.code}
                  helperText={errors.code?.message}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('levels.name')}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="displayOrder"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label={t('levels.displayOrder')}
                  fullWidth
                  error={!!errors.displayOrder}
                  helperText={errors.displayOrder?.message}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={isLoading}>
            {t('modal.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
            {t('modal.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LevelModal;
