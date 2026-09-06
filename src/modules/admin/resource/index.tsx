import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { useGetResources, useDeleteResource } from '@/apis/resource/hook';
import { useBulkDeleteResource } from '@/apis/resource/hook/useBulkDeleteResource';
import { IResource } from '@/types/admin/resource.type';
import { IconTrash } from '@tabler/icons-react';

import ResourceFilter from './components/ResourceFilter';
import ResourceTable from './components/table/ResourceTable';
import ResourceForm from './components/form/ResourceForm';
import ConfirmDeleteResourceModal from './components/modal/ConfirmDeleteResourceModal';
import ConfirmBulkDeleteResourceModal from './components/modal/ConfirmBulkDeleteResourceModal';
import ResourcePreviewModal from './components/modal/ResourcePreviewModal';

export default function ResourceModule() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource' });
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<{ keyword: string; domainId: number | null }>({
    keyword: '',
    domainId: null,
  });
  const [page, setPage] = useState(1);
  const size = 10;

  const { data: resourceData, isLoading } = useGetResources({
    domainId: filter.domainId,
    keyword: filter.keyword,
    page,
    size,
  });

  const deleteMutation = useDeleteResource();

  const [openForm, setOpenForm] = useState(false);
  const [selectedResource, setSelectedResource] = useState<IResource | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<IResource | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [resourceToPreview, setResourceToPreview] = useState<IResource | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const bulkDeleteMutation = useBulkDeleteResource();

  const handleOpenForm = (resource?: IResource) => {
    if (resource) {
      setSelectedResource(resource);
    } else {
      setSelectedResource(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedResource(null);
  };

  const handleOpenDelete = (resource: IResource) => {
    setResourceToDelete(resource);
    setOpenDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteModal(false);
    setResourceToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (resourceToDelete) {
      deleteMutation.mutate(resourceToDelete.id, {
        onSuccess: () => {
          toast.success(t('delete.success'));
          handleCloseDelete();
        },
        onError: () => {
          toast.error(t('delete.error'));
        }
      });
    }
  };

  const handleOpenPreview = (resource: IResource) => {
    setResourceToPreview(resource);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setResourceToPreview(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = resourceData?.result?.data?.map((n) => n.id) || [];
      setSelectedIds(newSelected);
      return;
    }
    setSelectedIds([]);
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

  const handleBulkDelete = () => {
    if (selectedIds.length > 0) {
      setIsBulkDeleteOpen(true);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {t('title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('subtitle')}
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          {selectedIds.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<IconTrash size={18} />}
              onClick={handleBulkDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              Xóa {selectedIds.length} mục
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus />}
            onClick={() => handleOpenForm()}
          >
            {t('newResource')}
          </Button>
        </Box>
      </Box>

      <ResourceFilter
        filter={filter}
        onFilterChange={(newFilter) => {
          setFilter(newFilter);
          setPage(1);
        }}
      />

      <ResourceTable
        data={resourceData?.result?.data || []}
        onEdit={handleOpenForm}
        onDelete={handleOpenDelete}
        onPreview={handleOpenPreview}
        totalElements={resourceData?.result?.totalElements || 0}
        page={page}
        size={size}
        onPageChange={(newPage) => setPage(newPage)}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {openForm && (
        <ResourceForm
          open={openForm}
          onClose={handleCloseForm}
          detailData={selectedResource}
          isEdit={!!selectedResource}
        />
      )}

      {openDeleteModal && (
        <ConfirmDeleteResourceModal
          open={openDeleteModal}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
          title={resourceToDelete?.title || ''}
        />
      )}

      <ConfirmBulkDeleteResourceModal
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        selectedIds={selectedIds}
        onSuccess={() => setSelectedIds([])}
      />

      {openPreview && resourceToPreview && (
        <ResourcePreviewModal
          open={openPreview}
          onClose={handleClosePreview}
          url={resourceToPreview.url}
          title={resourceToPreview.title}
        />
      )}
    </Box>
  );
}
