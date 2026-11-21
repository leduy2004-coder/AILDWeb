'use client';

import React, { useState } from 'react';
import { Box, Grid, CircularProgress, Alert, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AdminOverviewCards } from './components/AdminOverviewCards';
import { ScoreByDomainChart } from './components/ScoreByDomainChart';
import { ProficiencyDistribution } from './components/ProficiencyDistribution';
import { AttentionTabs } from './components/AttentionTabs';
import { ActivityChart } from './components/ActivityChart';
import { ScorePartsCard } from './components/ScorePartsCard';
import { ImprovementCard } from './components/ImprovementCard';
import { useGetOverview } from '@/apis/overview/hook';
import DomainDetailModal from './modal/DomainDetailModal';
import LevelDetailModal from './modal/LevelDetailModal';
import ImprovementModal from './modal/ImprovementModal';

export default function AdminOverviewModule() {
  const { t } = useTranslation('admin_overview');
  const { data: response, isLoading: loading, error } = useGetOverview();
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [improvementOpen, setImprovementOpen] = useState(false);

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
        <Grid size={{ xs: 12, md: 8 }}>
          <ActivityChart />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {/* The improvement card takes the height left by the short score parts card */}
          <Stack spacing={3} height="100%">
            <Box flex={1}>
              <ImprovementCard data={data?.improvement} onOpenList={() => setImprovementOpen(true)} />
            </Box>
            <Box>
              <ScorePartsCard data={data?.scoreParts} />
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={1}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ScoreByDomainChart data={data?.scoreByDomain} onDomainClick={setSelectedDomainId} />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <ProficiencyDistribution data={data?.proficiencyDistribution} onLevelClick={setSelectedLevelId} />
        </Grid>
      </Grid>

      <Box mt={3}>
        <AttentionTabs status={data?.assessmentStatus} completedAssessments={data?.completedAssessments} />
      </Box>

      <DomainDetailModal domainId={selectedDomainId} onClose={() => setSelectedDomainId(null)} />
      <LevelDetailModal levelId={selectedLevelId} onClose={() => setSelectedLevelId(null)} />
      <ImprovementModal open={improvementOpen} onClose={() => setImprovementOpen(false)} />
    </Box>
  );
}
