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
  CircularProgress
} from '@mui/material';
import { IconCertificate, IconX, IconDownload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { StudentApi } from '@/apis/student/student.api';

interface HomeCertificateProps {
  isEvaluated?: boolean;
}

const HomeCertificate = ({ isEvaluated }: HomeCertificateProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  if (!isEvaluated) {
    return null;
  }

  const handleOpen = async () => {
    setOpen(true);
    if (!pdfUrl) {
      setLoading(true);
      try {
        const blob = await StudentApi.getStudentCertificateBlob();
        if (blob instanceof Blob) {
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } else {
            console.error("Not a blob", blob);
        }
      } catch (error) {
        console.error('Failed to load certificate:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'AILD_Certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        variant="contained"
        startIcon={<IconCertificate />}
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
        PaperProps={{
          sx: { borderRadius: '16px', overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          p: 2.5
        }}>
          <Typography component="div" variant="h6" fontWeight={700} color="#1E293B" display="flex" alignItems="center" gap={1}>
            <IconCertificate color="#10B981" />
            {t('home.certificate.title')}
          </Typography>
          <Box display="flex" gap={1}>
            <Button 
                startIcon={<IconDownload size={18} />}
                variant="outlined"
                color="primary"
                onClick={handleDownload}
                disabled={!pdfUrl}
                sx={{ textTransform: 'none', borderRadius: '8px' }}
            >
                {t('home.certificate.downloadBtn')}
            </Button>
            <IconButton onClick={handleClose} size="small" sx={{ color: '#64748B' }}>
              <IconX />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: '75vh', position: 'relative' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              title="Certificate PDF"
            />
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
