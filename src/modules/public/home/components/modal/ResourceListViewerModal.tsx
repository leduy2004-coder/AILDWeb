import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { IconX, IconArrowLeft, IconExternalLink, IconArrowUpRight, IconBrandYoutube, IconPresentation, IconFileText, IconArticle } from '@tabler/icons-react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import { detectResourceType, getEmbedUrl } from '@/utils/resource.util';
import { IStudentRecommendedResource } from '@/types/student/student-dashboard.type';

interface Props {
  resources: IStudentRecommendedResource[];
  initialResource?: IStudentRecommendedResource;
}

const getResourceIcon = (url?: string) => {
  if (!url) return <IconArticle size={20} color="#10B981" />;
  const type = detectResourceType(url);
  switch (type) {
    case 'youtube': return <IconBrandYoutube size={20} color="#E53935" />;
    case 'google_slide': return <IconPresentation size={20} color="#F59E0B" />;
    case 'google_doc': return <IconFileText size={20} color="#2563EB" />;
    case 'pdf': return <IconFileText size={20} color="#EF4444" />;
    default: return <IconArticle size={20} color="#10B981" />;
  }
};

export const ResourceListViewerModal = NiceModal.create(({ resources = [], initialResource }: Props) => {
  const modal = useModal();
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState<IStudentRecommendedResource | null>(initialResource || null);

  useEffect(() => {
    if (modal.visible) {
      setSelectedResource(initialResource || null);
    }
  }, [modal.visible, initialResource]);

  const handleClose = () => {
    setSelectedResource(null);
    modal.hide();
  };

  const handleOpenLinkFallback = (url: string) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog
      open={modal.visible}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return;
        handleClose();
      }}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          height: '85vh',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid #E2E8F0' }}>
        <Box display="flex" alignItems="center" gap={1}>
          {selectedResource ? (
            <>
              <IconButton onClick={() => setSelectedResource(null)} size="small" sx={{ mr: 1 }}>
                <IconArrowLeft />
              </IconButton>
              <Typography variant="h6" component="div">
                {t('home.recommendations.previewTitle', 'Đang xem: ')}{selectedResource.title}
              </Typography>
            </>
          ) : (
            <Typography variant="h6" component="div">
              {t('home.recommendations.modalTitle', 'Tài nguyên đề xuất')}
            </Typography>
          )}
        </Box>
        <IconButton onClick={handleClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: selectedResource ? 0 : 3, backgroundColor: selectedResource ? '#000' : '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        {selectedResource ? (
          // VIEWER MODE
          (() => {
            const url = selectedResource.url || '';
            const type = detectResourceType(url);
            const embedUrl = getEmbedUrl(url, type);

            if (type === 'article') {
              return (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={2} p={4} textAlign="center" bgcolor="grey.50">
                  <Typography variant="h6" color="text.secondary">
                    {t('home.recommendations.unsupportedPreview', 'Tài liệu này không hỗ trợ xem trực tiếp trong modal.')}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<IconExternalLink size={18} />}
                    onClick={() => handleOpenLinkFallback(url)}
                  >
                    {t('home.recommendations.openInNewTab', 'Mở liên kết ở tab mới')}
                  </Button>
                </Box>
              );
            }
            return (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', flexGrow: 1 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            );
          })()
        ) : (
          // LIST MODE
          resources.length === 0 ? (
            <Box p={4} textAlign="center">
              <Typography color="text.secondary">
                {t('home.recommendations.noResources', 'Chưa có tài nguyên nào được đề xuất.')}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3} sx={{ p: 1 }}>
              {resources.map((item) => (
                <Grid size={{ xs: 12, md: 4 }} key={item.id}>
                  <Card
                    elevation={0}
                    onClick={() => setSelectedResource(item)}
                    sx={{
                      position: 'relative',
                      border: '1px solid #E2E8F0',
                      borderRadius: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundColor: '#FFFFFF',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: '#93C5FD',
                        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1)',
                        transform: 'translateY(-4px)',
                        '& .icon-arrow': {
                          transform: 'translate(4px, -4px)',
                          color: '#2563EB',
                        }
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Box sx={{ display: 'flex', p: 0.5, borderRadius: '8px', backgroundColor: '#F1F5F9' }}>
                            {getResourceIcon(item.url)}
                          </Box>
                          <Chip
                            label={item.domainName || item.domainCode || 'AI'}
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              backgroundColor: '#EFF6FF',
                              color: '#1E40AF',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              height: '24px',
                            }}
                          />
                        </Box>
                        <IconArrowUpRight className="icon-arrow" size={20} color="#94A3B8" style={{ transition: 'all 0.3s' }} />
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="text.primary"
                        mb={1.5}
                        sx={{
                          fontSize: '1.1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          lineHeight: 1.6,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto" pt={2} sx={{ borderTop: '1px solid #F1F5F9' }}>
                        <Typography
                          sx={{
                            color: '#2563EB',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                          }}
                        >
                          {t('home.recommendations.viewDocument', 'Xem tài liệu')}
                        </Typography>
                        {item.targetLevelName && (
                          <Chip
                            label={item.targetLevelName}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: '22px', borderRadius: '6px', color: '#64748B', borderColor: '#CBD5E1' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}
      </DialogContent>
    </Dialog>
  );
});
