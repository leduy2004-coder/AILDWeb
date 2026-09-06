import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Button } from '@mui/material';
import { IconX, IconExternalLink } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { detectResourceType, getEmbedUrl } from '@/utils/resource.util';

interface Props {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ResourcePreviewModal({ open, onClose, url, title }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.preview' });
  const type = detectResourceType(url);
  const embedUrl = getEmbedUrl(url, type);

  return (
    <Dialog 
      open={open} 
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        onClose();
      }} 
      maxWidth="lg" 
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          {t('title')}{title}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        {type === 'article' ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={2} p={4} textAlign="center" bgcolor="grey.50">
            <Typography variant="h6" color="text.secondary">
              {t('articleNote')}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {t('articleWarning')}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<IconExternalLink size={18} />}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('openLink')}
            </Button>
          </Box>
        ) : (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
