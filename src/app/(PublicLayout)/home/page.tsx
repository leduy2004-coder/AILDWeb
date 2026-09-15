'use client';

import React from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { HomeWelcome } from '@/modules/public/home/components/HomeWelcome';
import { HomeProgress } from '@/modules/public/home/components/HomeProgress';
import { HomeAiFeedback } from '@/modules/public/home/components/HomeAiFeedback';
import { HomeRecommendations } from '@/modules/public/home/components/HomeRecommendations';
import HomeCertificate from '@/modules/public/home/components/HomeCertificate';
import { useGetStudentDashboard } from '@/apis/student/hook';

export default function HomePage() {
  const { data, isLoading, isError } = useGetStudentDashboard();

  const dashboardData = data?.result;

  return (
    <PageContainer title="Trang chủ" description="Dashboard AILD">
      <Box sx={{ py: 6, backgroundColor: '#f9f9f9', minHeight: 'calc(100vh - 150px)' }}>
        <Container maxWidth="lg">
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={10}>
              <CircularProgress size={40} />
            </Box>
          ) : isError ? (
            <Box mb={4}>
              <Alert severity="error">
                Không thể tải dữ liệu bảng điều khiển sinh viên. Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.
              </Alert>
              <HomeWelcome lastEvaluationDate={null} isEvaluated={false} />
              <HomeProgress domainProgresses={[]} isEvaluated={false} />
              <HomeAiFeedback aiFeedback={null} isEvaluated={false} domainProgresses={[]} />
              <HomeRecommendations recommendedResources={[]} />
            </Box>
          ) : (
            <>
              <HomeWelcome
                lastEvaluationDate={dashboardData?.lastEvaluationDate}
                isEvaluated={dashboardData?.isEvaluated}
                finalScore={dashboardData?.finalScore}
              />
              <HomeProgress
                domainProgresses={dashboardData?.domainProgresses}
                skillNodes={dashboardData?.skillNodes}
                isEvaluated={dashboardData?.isEvaluated}
                lastEvaluationDate={dashboardData?.lastEvaluationDate}
              />
              <HomeCertificate isEvaluated={dashboardData?.isEvaluated} />
              <HomeAiFeedback
                aiFeedback={dashboardData?.aiFeedback}
                isEvaluated={dashboardData?.isEvaluated}
                domainProgresses={dashboardData?.domainProgresses}
              />
              <HomeRecommendations
                recommendedResources={dashboardData?.recommendedResources}
              />
            </>
          )}
        </Container>
      </Box>
    </PageContainer>
  );
}
