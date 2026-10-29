'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconBrandYoutube, IconPresentation, IconFileText, IconArticle, IconHeart, IconHeartFilled, IconFlag } from '@tabler/icons-react';
import NiceModal from '@ebay/nice-modal-react';
import { IStudentRecommendedResource } from '@/types/student/student-dashboard.type';
import { detectResourceType } from '@/utils/resource.util';
import { StudentApi } from '@/apis/student/student.api';
import ReportResourceModal from './modal/ReportResourceModal';
import { getLocalizedDomain, getLocalizedLevel } from '../constant/home-resource.constant';

interface HomeRecommendationsProps {
  recommendedResources?: IStudentRecommendedResource[];
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

// Stable default: a new [] on every render would retrigger the effect below and loop forever (guest /home)
const NO_RESOURCES: IStudentRecommendedResource[] = [];

export const HomeRecommendations: React.FC<HomeRecommendationsProps> = ({ recommendedResources = NO_RESOURCES }) => {
  const { t } = useTranslation();
  const [likesInfo, setLikesInfo] = React.useState<Record<number, { count: number; isLiked: boolean }>>({});
  const [selectedResourceForReport, setSelectedResourceForReport] = React.useState<IStudentRecommendedResource | null>(null);
  const [reportedResources, setReportedResources] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    const initLikes: Record<number, { count: number; isLiked: boolean }> = {};
    const initReports: Record<number, boolean> = {};
    recommendedResources.forEach((res) => {
      initLikes[res.id] = { count: res.likeCount || 0, isLiked: res.isLiked || false };
      initReports[res.id] = res.isReported || false;
    });
    setLikesInfo(initLikes);
    setReportedResources(initReports);
  }, [recommendedResources]);

  const handleToggleLike = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      // Optimistic update
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
      // Revert if failed (optional, but skipping for simplicity)
    }
  };

  const handleOpenLink = (url: string) => {
    if (!url) return;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://${url}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          {t('home.recommendations.title', 'Đề xuất cho bạn')}
        </Typography>
        <Typography
          component="span"
          onClick={() => {
            NiceModal.show('home-resource-list-modal', { resources: recommendedResources });
          }}
          sx={{
            color: '#1E3A8A',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          {t('home.recommendations.viewAll', 'Xem tất cả')}
        </Typography>
      </Box>

      {recommendedResources.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Typography color="text.secondary">
            {t('admin_resource.table.empty', 'Không tìm thấy tài nguyên nào.')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5, lg: 3 }}>
          {recommendedResources.map((item) => {
            const domainLabel = getLocalizedDomain(item, t);
            const levelLabel = getLocalizedLevel(item, t);

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <Card
                  elevation={0}
                  onClick={() => NiceModal.show('home-resource-list-modal', { resources: recommendedResources, initialResource: item })}
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
                          <Tooltip title={domainLabel}>
                            <Chip
                              label={domainLabel}
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
                              if (!reportedResources[item.id]) {
                                setSelectedResourceForReport(item);
                              }
                            }}
                            disabled={reportedResources[item.id]}
                            sx={{ 
                              p: 0.75,
                              color: reportedResources[item.id] ? '#EF4444' : '#94A3B8',
                              opacity: reportedResources[item.id] ? 0.5 : 1,
                              transition: 'all 0.2s',
                              '&:hover': { color: '#EF4444' }
                            }}
                            title={reportedResources[item.id] ? "Đã báo cáo" : "Báo cáo lỗi"}
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
                        {levelLabel && (
                          <Chip
                            label={levelLabel}
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
                          <Tooltip title={domainLabel}>
                            <Chip
                              label={domainLabel}
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
                          {levelLabel && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                              • {levelLabel}
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
                          onClick={(e) => { e.stopPropagation(); if (!reportedResources[item.id]) setSelectedResourceForReport(item); }}
                          disabled={reportedResources[item.id]}
                          sx={{ p: 0.5, color: reportedResources[item.id] ? '#EF4444' : '#94A3B8', opacity: reportedResources[item.id] ? 0.5 : 1 }}
                          title={reportedResources[item.id] ? "Đã báo cáo" : "Báo cáo lỗi"}
                        >
                          <IconFlag size={16} />
                        </IconButton>
                      </Box>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {selectedResourceForReport && (
        <ReportResourceModal
          open={!!selectedResourceForReport}
          onClose={() => setSelectedResourceForReport(null)}
          resourceId={selectedResourceForReport.id}
          resourceTitle={selectedResourceForReport.title}
          onReportSuccess={() => {
            setReportedResources(prev => ({ ...prev, [selectedResourceForReport.id]: true }));
          }}
        />
      )}
    </Box>
  );
};
