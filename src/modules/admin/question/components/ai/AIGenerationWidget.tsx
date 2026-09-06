import React from 'react';
import { Fab, CircularProgress, Tooltip, Box, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

interface Props {
  status: 'IDLE' | 'GENERATING' | 'SUCCESS' | 'ERROR';
  onClick: () => void;
  onClose: () => void;
}

export default function AIGenerationWidget({ status, onClick, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });

  if (status === 'IDLE') return null;

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: 26, zIndex: 1300, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title={status === 'GENERATING' ? t('ai.widgetGenerating') : status === 'SUCCESS' ? t('ai.widgetSuccess') : t('ai.widgetError')}>
        <Fab 
          color={status === 'SUCCESS' ? 'success' : status === 'ERROR' ? 'error' : 'primary'} 
          onClick={status === 'SUCCESS' ? onClick : undefined}
          sx={{ boxShadow: 3 }}
        >
          {status === 'GENERATING' && <CircularProgress color="inherit" size={24} />}
          {status === 'SUCCESS' && <Icon icon="solar:check-circle-bold" width={28} />}
          {status === 'ERROR' && <Icon icon="solar:close-circle-bold" width={28} />}
        </Fab>
      </Tooltip>
      {status !== 'GENERATING' && (
        <IconButton size="small" onClick={onClose} sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
          <Icon icon="solar:close-circle-line-duotone" width={20} />
        </IconButton>
      )}
    </Box>
  );
}
