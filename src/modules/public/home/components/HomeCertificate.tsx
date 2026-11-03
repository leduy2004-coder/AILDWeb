'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton, 
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IconCertificate, IconX, IconDownload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { StudentApi } from '@/apis/student/student.api';

interface HomeCertificateProps {
  isEvaluated?: boolean;
}

const HomeCertificate = ({ isEvaluated }: HomeCertificateProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isEvaluated) {
    return null;
  }

  const triggerDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AILD_Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadPdfUrl = async () => {
    if (pdfUrl) return pdfUrl;
    try {
      const blob = await StudentApi.getStudentCertificateBlob();
      if (blob instanceof Blob) {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        return url;
      }
      console.error("Not a blob", blob);
    } catch (error) {
      console.error('Failed to load certificate:', error);
    }
    return null;
  };

  const handleOpen = async () => {
    // Mobile: download the PDF directly
    if (fullScreen) {
      setLoading(true);
      const url = await loadPdfUrl();
      setLoading(false);
      if (url) triggerDownload(url);
      return;
    }

    setOpen(true);
    if (previewUrl) return;
    setLoading(true);
    try {
      const blob = await StudentApi.getStudentCertificatePreviewBlob();
      if (blob instanceof Blob) {
        setPreviewUrl(URL.createObjectURL(blob));
      } else {
        console.error("Not a blob", blob);
      }
    } catch (error) {
      console.error('Failed to load certificate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = async () => {
    setDownloading(true);
    const url = await loadPdfUrl();
    setDownloading(false);
    if (url) triggerDownload(url);
  };

  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IconCertificate />}
        onClick={handleOpen}
        sx={{
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
          }
        }}
      >
        {t('home.certificate.viewBtn')}
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        fullScreen={fullScreen}
        PaperProps={{
          sx: { borderRadius: fullScreen ? 0 : '16px', overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          p: 2.5
        }}>
          <Typography component="div" variant="h6" fontWeight={700} color="#1E293B" display="flex" alignItems="center" gap={1}>
            <IconCertificate color="#10B981" />
            {t('home.certificate.title')}
          </Typography>
          <Box display="flex" gap={1} width={{ xs: '100%', sm: 'auto' }} justifyContent="space-between">
            <Button 
                startIcon={downloading ? <CircularProgress size={18} color="inherit" /> : <IconDownload size={18} />}
                variant="outlined"
                color="primary"
                onClick={handleDownload}
                disabled={!previewUrl || downloading}
                sx={{ textTransform: 'none', borderRadius: '8px', flexGrow: { xs: 1, sm: 0 } }}
            >
                {t('home.certificate.downloadBtn')}
            </Button>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#64748B', ml: { xs: 1, sm: 0 } }}>
              <IconX />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1, sm: 3 }, height: '75vh', overflow: 'hidden', bgcolor: '#F1F5F9' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : previewUrl ? (
            // The image scales down to fit the dialog, so the whole certificate is visible without scrolling
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Box
                component="img"
                src={previewUrl}
                alt={t('home.certificate.title')}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  boxShadow: '0 8px 30px rgba(15, 23, 42, 0.15)',
                  backgroundColor: '#FFFFFF',
                }}
              />
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography color="error">{t('home.certificate.error')}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HomeCertificate;
