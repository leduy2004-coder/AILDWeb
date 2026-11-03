import React from 'react';
import { Box, FormControl, Select, MenuItem, FormControlLabel, Switch, Button } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CHUNK_STATUSES, DOMAIN_IDS } from '../constant/source-document.constant';

export interface ChunkFilterValue {
  status: string;
  domainId: number | null;
  lowConfidence: boolean;
}

export const EMPTY_CHUNK_FILTER: ChunkFilterValue = { status: '', domainId: null, lowConfidence: false };

interface Props {
  filter: ChunkFilterValue;
  onFilterChange: (filter: ChunkFilterValue) => void;
}

export default function ChunkFilter({ filter, onFilterChange }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });

  const isFiltered = filter.status || filter.domainId || filter.lowConfidence;

  return (
    <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <Select displayEmpty value={filter.status} onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}>
          <MenuItem value="">{t('filter.allStatuses')}</MenuItem>
          {CHUNK_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>{t(`chunkStatus.${s}`)}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <Select
          displayEmpty
          value={filter.domainId || ''}
          onChange={(e) => onFilterChange({ ...filter, domainId: e.target.value ? Number(e.target.value) : null })}
        >
          <MenuItem value="">{t('filter.allDomains')}</MenuItem>
          {DOMAIN_IDS.map((d) => (
            <MenuItem key={d} value={d}>{tDomain(d.toString())}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch checked={filter.lowConfidence} onChange={(e) => onFilterChange({ ...filter, lowConfidence: e.target.checked })} />}
        label={t('filter.lowConfidence')}
      />
      {isFiltered && (
        <Button variant="text" color="error" startIcon={<IconX size={18} />} onClick={() => onFilterChange(EMPTY_CHUNK_FILTER)}>
          {t('filter.clear')}
        </Button>
      )}
    </Box>
  );
}
