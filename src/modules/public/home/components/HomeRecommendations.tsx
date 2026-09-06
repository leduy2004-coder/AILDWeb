'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';
import { IStudentRecommendedResource } from '@/types/student/student-dashboard.type';

interface HomeRecommendationsProps {
  recommendedResources?: IStudentRecommendedResource[];
}

export const HomeRecommendations: React.FC<HomeRecommendationsProps> = ({ recommendedResources = [] }) => {
  const { t } = useTranslation();

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
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {t('home.recommendations.title', 'Đề xuất cho bạn')}
        </Typography>
        <Typography
          component={Link}
          href="/resources"
          sx={{
            color: '#1E3A8A',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': {
              textDecoration: 'underline',
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
        <Grid container spacing={3}>
          {recommendedResources.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.id}>
              <Card
                elevation={0}
                onClick={() => handleOpenLink(item.url)}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: '12px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={item.domainName || item.domainCode || 'AI'}
                      size="small"
                      sx={{
                        borderRadius: '4px',
                        backgroundColor: 'grey.100',
                        color: 'text.secondary',
                        fontWeight: 600,
                        fontSize: '11px',
                        height: '24px',
                      }}
                    />
                    <IconArrowUpRight size={20} color="#9CA3AF" />
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

                  <Box display="flex" alignItems="center" justifyContent="space-between" mt="auto">
                    <Typography
                      sx={{
                        color: '#1E3A8A',
                        fontWeight: 600,
                        fontSize: '14px',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t('home.recommendations.viewDocument', 'Xem tài liệu')}
                    </Typography>
                    {item.targetLevelName && (
                      <Chip
                        label={item.targetLevelName}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '10px', height: '20px' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
