import React from 'react';
import { Box, Button, TextField, InputAdornment, Stack, FormControl, Select, MenuItem } from '@mui/material';
import { IconSearch, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { USER_ROLE_OPTIONS } from '../constant/user.constant';

interface UserFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  roleQuery: string;
  onRoleChange: (role: string) => void;
  onAddClick: () => void;
  selectedCount: number;
  onBulkDeleteClick: () => void;
}

export default function UserFilter({
  searchQuery,
  onSearchChange,
  roleQuery,
  onRoleChange,
  onAddClick,
  selectedCount,
  onBulkDeleteClick,
}: UserFilterProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_user' });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      mb={3}
    >
      <Box display="flex" gap={2} flex={1} flexWrap="wrap" minWidth={{ xs: '100%', sm: 300 }}>
        <TextField
          sx={{ flex: 1, minWidth: 220, maxWidth: { sm: 400 } }}
          fullWidth
          size="small"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select displayEmpty value={roleQuery} onChange={(e) => onRoleChange(e.target.value)}>
            <MenuItem value="">{t('filter.allRoles')}</MenuItem>
            {USER_ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{t(option.labelKey)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {selectedCount > 0 && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<IconTrash size={18} />}
            onClick={onBulkDeleteClick}
          >
            {t('delete.confirm')} ({selectedCount})
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<IconPlus size={18} />}
          onClick={onAddClick}
        >
          {t('newUser')}
        </Button>
      </Stack>
    </Box>
  );
}
