'use client';

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DomainTable from './components/table/DomainTable';
import LevelTable from './components/table/LevelTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminConfigPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });
  const [tabValue, setTabValue] = useState(0);

  return (
    <PageContainer title={t('title')} description={t('subtitle')}>
      <Box>
        <Box mb={3} p={0} pb={0}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            {t('title')}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t('subtitle')}
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 1, border: 'none' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, v: number) => setTabValue(v)}>
              <Tab id="config-tab-0" label={t('tabs.domains')} />
              <Tab id="config-tab-1" label={t('tabs.levels')} />
            </Tabs>
          </Box>
          <Box p={3} pt={0}>
            <CustomTabPanel value={tabValue} index={0}>
              <DomainTable />
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
              <LevelTable />
            </CustomTabPanel>
          </Box>
        </Paper>
      </Box>
    </PageContainer>
  );
}
