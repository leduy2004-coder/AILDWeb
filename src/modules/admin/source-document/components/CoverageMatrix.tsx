import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useGetSourceCoverage } from '@/apis/source-document/hook';
import { COVERAGE_WARNING_THRESHOLD, DOMAIN_IDS } from '../constant/source-document.constant';

/** Active passages per competency domain; levels are not labelled because the prompt sets the Bloom level. */
export default function CoverageMatrix() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document.coverage' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });

  const { data, isLoading } = useGetSourceCoverage();
  const counts = new Map((data?.result || []).map((c) => [c.domainId, c.chunkCount]));

  const cellColor = (count: number) => {
    if (count === 0) return 'error.light';
    if (count < COVERAGE_WARNING_THRESHOLD) return 'warning.light';
    return 'success.light';
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" fontWeight={600}>{t('title')}</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {t('subtitle', { threshold: COVERAGE_WARNING_THRESHOLD })}
      </Typography>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={2}>
        {DOMAIN_IDS.map((d) => {
          const count = counts.get(d) ?? 0;
          return (
            <Paper key={d} variant="outlined" sx={{ p: 2, bgcolor: isLoading ? undefined : cellColor(count) }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>{tDomain(d.toString())}</Typography>
              {isLoading ? (
                <Skeleton width={60} />
              ) : (
                <Typography variant="h5" fontWeight={700}>{t('passages', { count })}</Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
