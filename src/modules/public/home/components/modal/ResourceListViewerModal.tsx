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
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { IconX, IconArrowLeft, IconExternalLink, IconArrowUpRight, IconBrandYoutube, IconPresentation, IconFileText, IconArticle, IconHeart, IconHeartFilled, IconFlag } from '@tabler/icons-react';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTranslation } from 'react-i18next';
import { detectResourceType, getEmbedUrl } from '@/utils/resource.util';
import { IStudentRecommendedResource } from '@/types/student/student-dashboard.type';
import { StudentApi } from '@/apis/student/student.api';
import ReportResourceModal from './ReportResourceModal';

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
  const [likesInfo, setLikesInfo] = useState<Record<number, { count: number; isLiked: boolean }>>({});
  const [selectedResourceForReport, setSelectedResourceForReport] = useState<IStudentRecommendedResource | null>(null);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (modal.visible) {
      setSelectedResource(initialResource || null);
      const initLikes: Record<number, { count: number; isLiked: boolean }> = {};
      resources.forEach((res) => {
        initLikes[res.id] = { count: res.likeCount || 0, isLiked: res.isLiked || false };
      });
      setLikesInfo(initLikes);
    }
  }, [modal.visible, initialResource, resources]);

  const handleToggleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      setLikesInfo((prev) => {
        const current = prev[id] || { count: 0, isLiked: false };
        return {
          ...prev,
          [id]: {
            count: current.isLiked ? Math.max(0, current.count - 1) : current.count + 1,
            isLiked: !current.isLiked
          }
        };
      });
      await StudentApi.toggleResourceLike(id);
    } catch (error) {
      console.error('Failed to toggle like', error);
    }
  };

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
      fullScreen={fullScreen || !!selectedResource}
      PaperProps={{
        sx: {
          borderRadius: (selectedResource || fullScreen) ? 0 : '16px',
          height: (selectedResource || fullScreen) ? '100%' : '85vh',
          maxHeight: '100%',
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
      
      <DialogContent sx={{ p: selectedResource ? 0 : { xs: 1.5, sm: 2, md: 3 }, backgroundColor: selectedResource ? '#000' : '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
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
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }} sx={{ p: { xs: 0, sm: 1 } }}>
              {resources.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card
                    elevation={0}
                    onClick={() => setSelectedResource(item)}
                    sx={{
                      position: 'relative',
                      border: '1px solid #E2E8F0',
                      borderRadius: { xs: '12px', sm: '16px' },
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
                    <CardContent sx={{ p: { xs: 1.25, sm: 2, md: 2, lg: 2.5 }, '&:last-child': { pb: { xs: 1.25, sm: 2, md: 2, lg: 2.5 } }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* DESKTOP LAYOUT */}
                      <Box display={{ xs: 'none', sm: 'flex' }} flexDirection="column" height="100%" flexGrow={1}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={1} mb={{ sm: 1.5, md: 2 }} minWidth={0}>
                          <Box display="flex" alignItems="center" gap={1} minWidth={0} flexShrink={1}>
                            <Box sx={{ display: 'flex', p: 0.5, borderRadius: '8px', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
                              {getResourceIcon(item.url)}
                            </Box>
                            <Tooltip title={item.domainName || item.domainCode || 'AI'}>
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
                                  maxWidth: { sm: '110px', md: '125px', lg: '150px' },
                                  minWidth: 0,
                                  flexShrink: 1,
                                  '& .MuiChip-label': {
                                    display: 'block',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    px: 1,
                                  }
                                }}
                              />
                            </Tooltip>
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedResourceForReport(item);
                              }}
                              sx={{ 
                                p: 0.75,
                                color: '#94A3B8',
                                transition: 'all 0.2s',
                                '&:hover': { color: '#EF4444' }
                              }}
                              title="Báo cáo lỗi"
                            >
                              <IconFlag size={18} />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleToggleLike(e, item.id)}
                              sx={{ 
                                p: 0.75,
                                color: likesInfo[item.id]?.isLiked ? '#EF4444' : '#94A3B8',
                                transition: 'all 0.2s',
                                '&:hover': { color: '#EF4444', transform: 'scale(1.1)' }
                              }}
                              title={likesInfo[item.id]?.isLiked ? "Bỏ thích" : "Yêu thích"}
                            >
                              {likesInfo[item.id]?.isLiked ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
                            </IconButton>
                          </Box>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="text.primary"
                          mb={{ sm: 1, md: 1.5 }}
                          sx={{
                            fontSize: { sm: '1rem', md: '1.05rem', lg: '1.1rem' },
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: { sm: 2, md: 2.5 },
                            lineHeight: 1.5,
                            fontSize: { sm: '0.8rem', md: '0.875rem' },
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: { sm: 2, md: 3 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Box 
                          display="flex" 
                          alignItems="center" 
                          justifyContent="space-between" 
                          gap={1}
                          mt="auto" 
                          pt={{ sm: 1.5, md: 2 }} 
                          sx={{ borderTop: '1px solid #F1F5F9' }}
                        >
                          <Typography
                            sx={{
                              color: '#2563EB',
                              fontWeight: 600,
                              fontSize: { sm: '0.8rem', md: '0.875rem' },
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {t('home.recommendations.viewDocument', 'Xem tài liệu')}
                          </Typography>
                          {item.targetLevelName && (
                            <Chip
                              label={item.targetLevelName}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: '22px', 
                                borderRadius: '6px', 
                                color: '#64748B', 
                                borderColor: '#CBD5E1',
                                maxWidth: '120px',
                                flexShrink: 0,
                                '& .MuiChip-label': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  px: 1,
                                }
                              }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* MOBILE LAYOUT (HORIZONTAL COMPACT) */}
                      <Box display={{ xs: 'flex', sm: 'none' }} alignItems="center" gap={1.5} width="100%">
                        <Box sx={{ display: 'flex', p: 1, borderRadius: '10px', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
                          {getResourceIcon(item.url)}
                        </Box>
                        <Box flexGrow={1} minWidth={0} display="flex" flexDirection="column" gap={0.5}>
                          <Typography 
                            variant="subtitle2" 
                            fontWeight={700} 
                            color="text.primary" 
                            sx={{ 
                              display: '-webkit-box', 
                              WebkitLineClamp: 2, 
                              WebkitBoxOrient: 'vertical', 
                              overflow: 'hidden', 
                              lineHeight: 1.3,
                              fontSize: '0.875rem',
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap" minWidth={0}>
                            <Tooltip title={item.domainName || item.domainCode || 'AI'}>
                              <Chip
                                label={item.domainName || item.domainCode || 'AI'}
                                size="small"
                                sx={{
                                  borderRadius: '4px', 
                                  backgroundColor: '#EFF6FF', 
                                  color: '#1E40AF',
                                  fontWeight: 600, 
                                  fontSize: '9px', 
                                  height: '18px', 
                                  maxWidth: { xs: '150px', sm: '180px' },
                                  minWidth: 0,
                                  flexShrink: 1,
                                  '& .MuiChip-label': { 
                                    px: 1, 
                                    display: 'block', 
                                    whiteSpace: 'nowrap', 
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis' 
                                  }
                                }}
                              />
                            </Tooltip>
                            {item.targetLevelName && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                • {item.targetLevelName}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} flexShrink={0}>
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleToggleLike(e, item.id)} 
                            sx={{ p: 0.5, color: likesInfo[item.id]?.isLiked ? '#EF4444' : '#94A3B8' }}
                            title={likesInfo[item.id]?.isLiked ? "Bỏ thích" : "Yêu thích"}
                          >
                            {likesInfo[item.id]?.isLiked ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); setSelectedResourceForReport(item); }}
                            sx={{ p: 0.5, color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                            title="Báo cáo lỗi"
                          >
                            <IconFlag size={16} />
                          </IconButton>
                        </Box>
                      </Box>

                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )
        )}
      </DialogContent>

      {selectedResourceForReport && (
        <ReportResourceModal
          open={!!selectedResourceForReport}
          onClose={() => setSelectedResourceForReport(null)}
          resourceId={selectedResourceForReport.id}
          resourceTitle={selectedResourceForReport.title}
        />
      )}
    </Dialog>
  );
});
