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
import { useGetDomains, useCreateDomain, useDeleteDomain } from '@/apis/config/hook';
import DomainModal from '../modal/DomainModal';
import { DomainFormValues } from '../../schema/config.schema';
import ConfirmDeleteModal from '../modal/ConfirmDeleteModal';
import { toast } from 'react-toastify';

const DomainTable = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_configs' });
  const [openModal, setOpenModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: domainsRes, isLoading } = useGetDomains();
  const createDomain = useCreateDomain();

  const domains = domainsRes?.result || [];

  const handleAdd = (data: DomainFormValues) => {
    createDomain.mutate(data, {
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
        <Typography variant="h6">{t('tabs.domains')}</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenModal(true)}
        >
          {t('domains.add')}
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('domains.code')}</TableCell>
              <TableCell>{t('domains.name')}</TableCell>
              <TableCell>{t('domains.description')}</TableCell>
              <TableCell>{t('domains.displayOrder')}</TableCell>
              <TableCell align="right">{t('domains.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">{t('table.loading')}</TableCell>
              </TableRow>
            ) : domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">{t('table.noData')}</TableCell>
              </TableRow>
            ) : (
              domains.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.code}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
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

      <DomainModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleAdd}
        isLoading={createDomain.isPending}
      />

      <ConfirmDeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        deleteId={deleteId}
        type="domain"
      />
    </Box>
  );
};

export default DomainTable;
