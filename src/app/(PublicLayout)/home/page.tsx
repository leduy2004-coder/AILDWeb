import React from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Box, Container } from '@mui/material';
import { HomeWelcome } from '@/modules/public/home/components/HomeWelcome';
import { HomeProgress } from '@/modules/public/home/components/HomeProgress';
import { HomeRecommendations } from '@/modules/public/home/components/HomeRecommendations';

export default function HomePage() {
  return (
    <PageContainer title="Trang chủ" description="Dashboard AILD">
      <Box sx={{ py: 6, backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 150px)' }}>
        <Container maxWidth="lg">
          <HomeWelcome />
          <HomeProgress />
          <HomeRecommendations />
        </Container>
      </Box>
    </PageContainer>
  );
}
