import React from 'react';
import { Chip, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ILevelResult } from '@/types/admin/overview.type';

/** Same pass mark as the proficiency chart: at least half of a level's questions correct */
const PASS_RATE = 0.5;

interface Props {
  result: ILevelResult;
  /** Prefix the short level name (TH / VD / ST), for cells without a level column header */
  showLevel?: boolean;
}

/** "correct/answered · %" of one level, green when passed; a dash when the adaptive test asked nothing at that level. */
export default function LevelResultChip({ result, showLevel = false }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const prefix = showLevel ? `${t(`level.short.${result.levelId}`)} ` : '';

  if (result.answered === 0) {
    return (
      <Tooltip title={t('levelDetail.notAsked')}>
        <Typography variant="body2" color="text.disabled" component="span">{prefix}—</Typography>
      </Tooltip>
    );
  }

  const rate = result.correct / result.answered;
  return (
    <Chip
      size="small"
      variant="outlined"
      color={rate >= PASS_RATE ? 'success' : 'error'}
      label={`${prefix}${result.correct}/${result.answered}${showLevel ? '' : ` · ${Math.round(rate * 100)}%`}`}
    />
  );
}
