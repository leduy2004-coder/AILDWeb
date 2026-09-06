import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Typography, Box, Link, Checkbox, TablePagination } from '@mui/material';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { IResource } from '@/types/admin/resource.type';
import { QUESTION_DOMAIN_COLOR } from '@/modules/admin/question/constant/question.constant';

interface ResourceTableProps {
  data: IResource[];
  onEdit: (resource: IResource) => void;
  onDelete: (resource: IResource) => void;
  onPreview: (resource: IResource) => void;
  totalElements: number;
  page: number;
  size: number;
  onPageChange: (newPage: number) => void;
  selectedIds: number[];
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
}

export default function ResourceTable({ 
  data, 
  onEdit, 
  onDelete, 
  onPreview,
  totalElements,
  page,
  size,
  onPageChange,
  selectedIds,
  onSelectAll,
  onSelectOne,
}: ResourceTableProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.table' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const { t: tLevel } = useTranslation('translation', { keyPrefix: 'admin_overview.level.name' });

  const getDomainColor = (domainId: number) => QUESTION_DOMAIN_COLOR[domainId] || 'default';

  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table>
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
            <TableCell width="40%"><Typography variant="subtitle2" fontWeight={600}>{t('title')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('domain')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('level')}</Typography></TableCell>
            <TableCell><Typography variant="subtitle2" fontWeight={600}>{t('updatedAt', { defaultValue: 'NGÀY CẬP NHẬT' })}</Typography></TableCell>
            <TableCell align="right"><Typography variant="subtitle2" fontWeight={600}>{t('action')}</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">{t('empty')}</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              const isSelected = selectedIds.indexOf(row.id) !== -1;
              const dateVal = row.modifiedDate || row.updatedAt;
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
                  <Box>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 0.5 }}>
                      {row.title}
                    </Typography>
                    <Link
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      color="primary"
                      sx={{
                        display: 'inline-block',
                        maxWidth: { xs: 200, sm: 350, md: 500 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        verticalAlign: 'bottom',
                      }}
                    >
                      {row.url}
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={tDomain(row.domainId.toString())} size="small" color={getDomainColor(row.domainId)} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{tLevel(row.targetLevelId.toString())}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {(() => {
                      if (!dateVal) return '-';
                      const d = new Date(dateVal);
                      if (isNaN(d.getTime())) return '-';
                      const pad = (n: number) => n.toString().padStart(2, '0');
                      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
                    })()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="info" onClick={() => onPreview(row)} title={t('actionPreview')}>
                    <IconEye size={18} />
                  </IconButton>
                  <IconButton size="small" color="primary" onClick={() => onEdit(row)} title={t('actionEdit')}>
                    <IconEdit size={18} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(row)} title={t('actionDelete')}>
                    <IconTrash size={18} />
                  </IconButton>
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
        page={page - 1} // MUI uses 0-based indexing for page
        onPageChange={(e, newPage) => onPageChange(newPage + 1)} // we use 1-based indexing
      />
    </TableContainer>
  );
}
