import React, { useState } from 'react';
import { Box, TextField, InputAdornment, FormControl, Select, MenuItem, Button } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';


interface ResourceFilterProps {
  filter: {
    keyword: string;
    domainId: number | null;
  };
  onFilterChange: (filter: { keyword: string; domainId: number | null }) => void;
}

export default function ResourceFilter({ filter, onFilterChange }: ResourceFilterProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.filter' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });



  const handleClear = () => {
    onFilterChange({ keyword: '', domainId: null });
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

      {(filter.keyword || filter.domainId) && (
        <Button variant="text" color="error" startIcon={<IconX size={18} />} onClick={handleClear}>
          Xóa lọc
        </Button>
      )}
    </Box>
  );
}
