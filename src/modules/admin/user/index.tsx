import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchUsers, useDeleteUsers } from '@/apis/user/hook';
import { IUser } from '@/types/users/user.type';
import UserFilter from './components/UserFilter';
import UserTable from './components/UserTable';
import UserFormModal from './components/form/UserFormModal';
import ConfirmDeleteUserModal from './components/modal/ConfirmDeleteUserModal';
import ConfirmBulkDeleteUserModal from './components/modal/ConfirmBulkDeleteUserModal';

export default function UserModule() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_user' });

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const size = 10;

  const { data: userData } = useSearchUsers(page, size, searchQuery || undefined, undefined);
  const deleteMutation = useDeleteUsers();

  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const userList: IUser[] = userData?.result?.data || userData?.result?.content || [];
  const totalElements: number = userData?.result?.totalElements || 0;

  const handleOpenForm = (user?: IUser) => {
    setSelectedUser(user || null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedUser(null);
  };

  const handleOpenDelete = (user: IUser) => {
    setUserToDelete(user);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
    setUserToDelete(null);
  };

  const handleConfirmSingleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate([userToDelete.id], {
        onSuccess: () => {
          toast.success(t('delete.success'));
          handleCloseDelete();
          setSelectedIds((prev) => prev.filter((id) => id !== userToDelete.id));
        },
        onError: () => {
          toast.error(t('delete.error'));
        },
      });
    }
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      deleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          toast.success(t('delete.success'));
          setOpenBulkDeleteModal(false);
          setSelectedIds([]);
        },
        onError: () => {
          toast.error(t('delete.error'));
        },
      });
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(userList.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }
    setSelectedIds(newSelected);
  };

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {t('title')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('subtitle')}
        </Typography>
      </Box>

      <UserFilter
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setPage(1);
        }}
        onAddClick={() => handleOpenForm()}
        selectedCount={selectedIds.length}
        onBulkDeleteClick={() => setOpenBulkDeleteModal(true)}
      />

      <UserTable
        data={userList}
        totalElements={totalElements}
        page={page}
        size={size}
        onPageChange={(newPage) => setPage(newPage)}
        onEdit={handleOpenForm}
        onDelete={handleOpenDelete}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {openForm && (
        <UserFormModal
          open={openForm}
          onClose={handleCloseForm}
          detailData={selectedUser}
          isEdit={!!selectedUser}
        />
      )}

      {openDeleteModal && userToDelete && (
        <ConfirmDeleteUserModal
          open={openDeleteModal}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmSingleDelete}
          name={userToDelete.name}
        />
      )}

      {openBulkDeleteModal && (
        <ConfirmBulkDeleteUserModal
          open={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          onConfirm={handleConfirmBulkDelete}
          count={selectedIds.length}
        />
      )}
    </Box>
  );
}
