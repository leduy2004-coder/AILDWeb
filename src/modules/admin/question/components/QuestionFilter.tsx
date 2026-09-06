import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel, Button, TextField, InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IQuestionFilter } from '@/types/admin/question.type';
import { Icon } from '@iconify/react';

interface Props {
  filter: IQuestionFilter;
  onFilterChange: (filter: Partial<IQuestionFilter>) => void;
}

export default function QuestionFilter({ filter, onFilterChange }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const { t: tLevel } = useTranslation('translation', { keyPrefix: 'admin_overview.level.name' });

  const handleClear = () => {
    onFilterChange({ domainId: null, levelId: null, status: null, keyword: '' });
  };

  return (
    <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
      <TextField
        size="small"
        placeholder="Tìm kiếm câu hỏi..."
        value={filter.keyword || ''}
        onChange={(e) => onFilterChange({ keyword: e.target.value })}
        sx={{ minWidth: 250, bgcolor: 'background.paper', borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon icon="solar:magnifer-linear" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
        <InputLabel>{t('filters.allDomains')}</InputLabel>
        <Select
          value={filter.domainId || ''}
          label={t('filters.allDomains')}
          onChange={(e) => onFilterChange({ domainId: e.target.value ? Number(e.target.value) : null })}
        >
          <MenuItem value=""><em>{t('filters.allDomains')}</em></MenuItem>
          <MenuItem value={1}>{tDomain('1')}</MenuItem>
          <MenuItem value={2}>{tDomain('2')}</MenuItem>
          <MenuItem value={3}>{tDomain('3')}</MenuItem>
          <MenuItem value={4}>{tDomain('4')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
        <InputLabel>{t('filters.allLevels')}</InputLabel>
        <Select
          value={filter.levelId || ''}
          label={t('filters.allLevels')}
          onChange={(e) => onFilterChange({ levelId: e.target.value ? Number(e.target.value) : null })}
        >
          <MenuItem value=""><em>{t('filters.allLevels')}</em></MenuItem>
          <MenuItem value={1}>{tLevel('1')}</MenuItem>
          <MenuItem value={2}>{tLevel('2')}</MenuItem>
          <MenuItem value={3}>{tLevel('3')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150, bgcolor: 'background.paper' }}>
        <InputLabel>{t('filters.allStatuses')}</InputLabel>
        <Select
          value={filter.status || ''}
          label={t('filters.allStatuses')}
          onChange={(e) => onFilterChange({ status: e.target.value as string || null })}
        >
          <MenuItem value=""><em>{t('filters.allStatuses')}</em></MenuItem>
          <MenuItem value="DRAFT">{t('status.DRAFT')}</MenuItem>
          <MenuItem value="PUBLISHED">{t('status.PUBLISHED')}</MenuItem>
          <MenuItem value="REJECTED">{t('status.REJECTED')}</MenuItem>
        </Select>
      </FormControl>

      {(filter.domainId || filter.levelId || filter.status || filter.keyword) && (
        <Button size="small" variant="text" color="inherit" onClick={handleClear} sx={{ ml: 'auto' }}>
          {t('filters.clearFilters')}
        </Button>
      )}
    </Box>
  );
}
