import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useGetLevels, useCreateLevel } from '@/apis/config/hook';
import LevelModal from '../modal/LevelModal';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import { LevelFormValues } from '../../schema/config.schema';
import { toast } from 'react-toastify';

const LevelTable = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: levelsRes, isLoading } = useGetLevels();
  const createLevel = useCreateLevel();

  const levels = levelsRes?.result || [];

  const handleAdd = (data: LevelFormValues) => {
    createLevel.mutate(data, {
      onSuccess: () => {
        toast.success(t('toast.addSuccess'));
        setOpenModal(false);
      },
      onError: () => {
        toast.error(t('toast.error'));
      },
    });
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{t('tabs.levels')}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
        >
          {t('levels.add')}
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('levels.code')}</TableCell>
              <TableCell>{t('levels.name')}</TableCell>
              <TableCell>{t('levels.displayOrder')}</TableCell>
              <TableCell align="right">{t('levels.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">{t('table.loading')}</TableCell>
              </TableRow>
            ) : levels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">{t('table.noData')}</TableCell>
              </TableRow>
            ) : (
              levels.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.displayOrder}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(row.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LevelModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAdd}
        isLoading={createLevel.isPending}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteId={deleteId}
        type="level"
      />
    </Box>
  );
};

export default LevelTable;
