import React from 'react';
import { Box, Button, TextField, InputAdornment, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

interface SubmissionFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusQuery: string;
  onStatusChange: (status: string) => void;
  selectedCount: number;
  onBulkDeleteClick: () => void;
}

export default function SubmissionFilter({
  searchQuery,
  onSearchChange,
  statusQuery,
  onStatusChange,
  selectedCount,
  onBulkDeleteClick,
}: SubmissionFilterProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      flexWrap="wrap"
      gap={2}
    >
      <Box display="flex" gap={2} flex={1} minWidth={300}>
        <TextField
          size="small"
          placeholder={t('filter.search', 'Tìm kiếm theo tên hoặc email...')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          fullWidth
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>{t('filter.status', 'Trạng thái')}</InputLabel>
          <Select
            value={statusQuery}
            label={t('filter.status', 'Trạng thái')}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <MenuItem value=""><em>{t('filter.all', 'Tất cả')}</em></MenuItem>
            <MenuItem value="IN_PROGRESS">{t('status.IN_PROGRESS', 'Đang làm')}</MenuItem>
            <MenuItem value="COMPLETED">{t('status.COMPLETED', 'Hoàn thành')}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box display="flex" gap={2} alignItems="center">
        {selectedCount > 0 && (
          <>
            <Typography variant="body2" color="text.secondary">
              {t('filter.selected', 'Đã chọn {{count}}', { count: selectedCount })}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onBulkDeleteClick}
            >
              {t('action.deleteSelected', 'Xóa')}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
