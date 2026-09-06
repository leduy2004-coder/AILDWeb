import React from 'react';
import { Box, Button, TextField, InputAdornment, Stack } from '@mui/material';
import { IconSearch, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface UserFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  selectedCount: number;
  onBulkDeleteClick: () => void;
}

export default function UserFilter({
  searchQuery,
  onSearchChange,
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
      <Box flex={1} minWidth={{ xs: '100%', sm: 300 }} maxWidth={{ sm: 400 }}>
        <TextField
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
