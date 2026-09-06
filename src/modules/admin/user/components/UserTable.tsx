import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Checkbox,
  TablePagination,
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IUser } from '@/types/users/user.type';
import { USER_ROLE_COLOR, USER_STATUS_COLOR } from '../constant/user.constant';

interface UserTableProps {
  data: IUser[];
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
  onEdit: (user: IUser) => void;
  onDelete: (user: IUser) => void;
  selectedIds: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

export default function UserTable({
  data,
  totalElements,
  page,
  size,
  onPageChange,
  onEdit,
  onDelete,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: UserTableProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_user' });

  const getRoleCode = (role: IUser['role']): string => {
    if (typeof role === 'string') return role;
    if (role && typeof role === 'object' && role.code) return role.code;
    return 'STUDENT';
  };

  const formatDateWithTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: 'grey.50' }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                checked={data.length > 0 && selectedIds.length === data.length}
                onChange={onSelectAll}
              />
            </TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.name')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.email')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.role')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.status')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('table.updatedAt')}</Typography></TableCell>
            <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>{t('table.action')}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">{t('table.empty')}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const isSelected = selectedIds.indexOf(row.id) !== -1;
              const roleCode = getRoleCode(row.role);
              const dateVal = row.modifiedDate || row.updatedAt || row.createdDate;
              const isStatusActive = row.status !== false;

              return (
                <TableRow key={row.id} hover selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={(event) => onSelectOne(event, row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`roles.${roleCode}`, { defaultValue: roleCode })}
                      size="small"
                      color={USER_ROLE_COLOR[roleCode] || 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isStatusActive ? t('status.active') : t('status.inactive')}
                      size="small"
                      color={USER_STATUS_COLOR[isStatusActive ? 'true' : 'false']}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateWithTime(dateVal)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      <IconButton size="small" color="primary" onClick={() => onEdit(row)} title={t('form.editTitle')}>
                        <IconEdit size={18} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDelete(row)} title={t('delete.title')}>
                        <IconTrash size={18} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={totalElements}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
      />
    </TableContainer>
  );
}
