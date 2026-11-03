import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useLabelSourceChunks } from '@/apis/source-document/hook';
import { DOMAIN_IDS } from '../../constant/source-document.constant';

interface Props {
  open: boolean;
  onClose: () => void;
  chunkIds: number[];
  onSuccess: () => void;
}

export default function BulkLabelForm({ open, onClose, chunkIds, onSuccess }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document.label' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const labelMutation = useLabelSourceChunks();

  // The parent mounts this dialog only while open, so the state starts fresh each time
  const [domainId, setDomainId] = useState(1);

  const handleSubmit = () => {
    labelMutation.mutate(
      { chunkIds, domainId },
      {
        onSuccess: () => {
          toast.success(t('success', { count: chunkIds.length }));
          onSuccess();
          onClose();
        },
        onError: () => toast.error(t('error')),
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{t('title', { count: chunkIds.length })}</Typography>
        <IconButton onClick={onClose} size="small"><IconX /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="body2" color="text.secondary">{t('note')}</Typography>
          <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('domain')}</Typography>
            <FormControl fullWidth>
              <Select value={domainId} onChange={(e) => setDomainId(Number(e.target.value))}>
                {DOMAIN_IDS.map((d) => (
                  <MenuItem key={d} value={d}>{tDomain(d.toString())}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={labelMutation.isPending}>
          {labelMutation.isPending ? <CircularProgress size={22} color="inherit" /> : t('submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
