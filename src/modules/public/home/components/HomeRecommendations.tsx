'use client';

import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconArrowUpRight } from '@tabler/icons-react';
import Link from 'next/link';

export const HomeRecommendations = () => {
  const { t } = useTranslation();

  const recommendations = [
    {
      tag: t('home.recommendations.tag1', 'ĐẠO ĐỨC AI'),
      title: t('home.recommendations.title1', 'Định kiến trong Mô hình Học máy'),
      description: t('home.recommendations.desc1', 'Hiểu các nguồn gốc gây định kiến trong các tập dữ liệu và việc ra quyết định của thuật toán, đồng thời ti...'),
      link: '#',
    },
    {
      tag: t('home.recommendations.tag2', 'KỸ THUẬT AI'),
      title: t('home.recommendations.title2', 'Nền tảng của Mạng Nơ-ron'),
      description: t('home.recommendations.desc2', 'Tìm hiểu sâu về kiến trúc của mạng nơ-ron hiện đại, lan truyền ngược và hàm kích hoạt.'),
      link: '#',
    },
    {
      tag: t('home.recommendations.tag3', 'THIẾT KẾ HỆ THỐNG'),
      title: t('home.recommendations.title3', 'Kiến trúc MLOps có thể mở rộng'),
      description: t('home.recommendations.desc3', 'Học cách triển khai, giám sát và bảo trì các mô hình học máy trong môi trường sản xuất một cách hiệu...'),
      link: '#',
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {t('home.recommendations.title', 'Đề xuất cho bạn')}
        </Typography>
        <Typography
          component={Link}
          href="#"
          sx={{
            color: '#1E3A8A', // Dark blue text
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

      <Grid container spacing={3}>
        {recommendations.map((item, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'grey.200',
                borderRadius: '12px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
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
                    label={item.tag}
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
                
                <Typography variant="h6" fontWeight={700} color="text.primary" mb={1.5} sx={{ fontSize: '1.1rem' }}>
                  {item.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, flexGrow: 1 }}>
                  {item.description}
                </Typography>
                
                <Typography
                  component={Link}
                  href={item.link}
                  sx={{
                    color: '#1E3A8A',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    mt: 'auto',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('home.recommendations.viewDocument', 'Xem tài liệu')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
