'use client';

import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AdminOverviewCards } from './components/AdminOverviewCards';
import { ScoreByDomainChart } from './components/ScoreByDomainChart';
import { ProficiencyDistribution } from './components/ProficiencyDistribution';
import { RecentActivityTable } from './components/RecentActivityTable';
import { useGetOverview } from '@/apis/overview/hook';

export default function AdminOverviewModule() {
  const { t } = useTranslation('admin_overview');
  const { data: response, isLoading: loading, error } = useGetOverview();
  
  const data = response?.result;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{t('errorFetchData')}</Alert>
      </Box>
    );
  }

  return (
    <Box>


      <AdminOverviewCards data={data || undefined} />

      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ScoreByDomainChart data={data?.scoreByDomain} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <ProficiencyDistribution data={data?.proficiencyDistribution} />
        </Grid>
      </Grid>

      <Box mt={3}>
        <RecentActivityTable data={data?.recentActivity} />
      </Box>
    </Box>
  );
}
