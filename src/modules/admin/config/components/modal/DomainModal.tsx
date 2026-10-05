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
import { DomainFormValues, getDomainSchema } from '../../schema/config.schema';

interface DomainModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DomainFormValues) => void;
  isLoading?: boolean;
}

const DomainModal: React.FC<DomainModalProps> = ({ open, onClose, onSubmit, isLoading }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DomainFormValues>({
    resolver: zodResolver(getDomainSchema(t)) as any,
    defaultValues: {
      code: '',
      name: '',
      description: '',
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
      <DialogTitle>{t('modal.addDomain')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Stack spacing={3}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('domains.code')}
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
                  label={t('domains.name')}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('domains.description')}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
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
                  label={t('domains.displayOrder')}
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

export default DomainModal;
