import React from 'react';
import { 
  Box, Card, CardContent, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Avatar, Chip, useTheme, Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IRecentActivity } from '@/types/admin/overview.type';

import { ACTIVITY_STATUS_COLOR } from '../constant/overview.constant';

interface Props {
  data?: IRecentActivity[];
}

export const RecentActivityTable = ({ data = [] }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_overview' });
  const theme = useTheme();

  const getStatusLabel = (status: string) => {
    return t(`status.${status}`);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('vi-VN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 1, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            {t('recentActivity')}
          </Typography>
          <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>
            {t('viewAll')}
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>{t('table.student')}</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>{t('table.questionSet')}</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>{t('table.score')}</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>{t('table.date')}</TableCell>
                <TableCell sx={{ color: theme.palette.text.secondary, fontWeight: 600 }}>{t('table.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={row.studentAvatar} sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.light }}>
                        {row.studentName.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {row.studentName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {t(row.questionSetName)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.score ? `${row.score}%` : '--'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(row.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(row.status)} 
                      color={(ACTIVITY_STATUS_COLOR[row.status] || 'default') as any} 
                      size="small"
                      sx={{ borderRadius: 1, fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      {t('noData')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
