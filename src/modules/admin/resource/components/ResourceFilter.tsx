import React from 'react';
import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, Button } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ResourceType } from '@/utils/resource.util';

export interface ResourceFilterValue {
  keyword: string;
  domainId: number | null;
  type: ResourceType | null;
}

// Same types as detectResourceType: derived from the URL, there is no type column
const RESOURCE_TYPES: ResourceType[] = ['youtube', 'article', 'pdf', 'google_doc', 'google_slide'];

interface ResourceFilterProps {
  filter: ResourceFilterValue;
  onFilterChange: (filter: ResourceFilterValue) => void;
}

export default function ResourceFilter({ filter, onFilterChange }: ResourceFilterProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.filter' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });

  const handleClear = () => {
    onFilterChange({ keyword: '', domainId: null, type: null });
  };

  return (
    <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
      <TextField
        placeholder={t('searchPlaceholder')}
        size="small"
        value={filter.keyword}
        onChange={(e) => onFilterChange({ ...filter, keyword: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconSearch size={18} />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 300, flex: 1 }}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          displayEmpty
          value={filter.domainId || ''}
          onChange={(e) => onFilterChange({ ...filter, domainId: e.target.value ? Number(e.target.value) : null })}
        >
          <MenuItem value="">{t('allDomains')}</MenuItem>
          <MenuItem value={1}>{tDomain('1')}</MenuItem>
          <MenuItem value={2}>{tDomain('2')}</MenuItem>
          <MenuItem value={3}>{tDomain('3')}</MenuItem>
          <MenuItem value={4}>{tDomain('4')}</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          displayEmpty
          value={filter.type || ''}
          onChange={(e) => onFilterChange({ ...filter, type: (e.target.value as ResourceType) || null })}
        >
          <MenuItem value="">{t('allTypes')}</MenuItem>
          {RESOURCE_TYPES.map((type) => (
            <MenuItem key={type} value={type}>{t(`type.${type}`)}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {(filter.keyword || filter.domainId || filter.type) && (
        <Button variant="text" color="error" startIcon={<IconX size={18} />} onClick={handleClear}>
          {t('clear')}
        </Button>
      )}
    </Box>
  );
}
