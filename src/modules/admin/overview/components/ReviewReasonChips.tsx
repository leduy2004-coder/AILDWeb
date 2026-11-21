import React from 'react';
import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReviewReason } from '@/types/admin/overview.type';

const REASON_COLOR: Record<ReviewReason, 'error' | 'warning' | 'info' | 'default'> = {
  FORCED_BY_VIOLATIONS: 'error',
  VIOLATIONS: 'warning',
  SCORE_GAP: 'info',
  TIMED_OUT: 'default',
};

interface Props {
  reasons: ReviewReason[];
  violationCount: number;
}

/** Why a submission may be worth a look: violations, timed out, multiple-choice/interview gap. */
export default function ReviewReasonChips({ reasons, violationCount }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  return (
    <Box display="flex" gap={0.5} flexWrap="wrap">
      {reasons.map((reason) => (
        <Chip
          key={reason}
          size="small"
          color={REASON_COLOR[reason]}
          variant={reason === 'TIMED_OUT' ? 'outlined' : 'filled'}
          label={t(`attention.reasons.${reason}`, { count: violationCount })}
        />
      ))}
    </Box>
  );
}
