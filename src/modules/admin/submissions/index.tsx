import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchAssessments, useDeleteAssessments } from '@/apis/assessment/hook/index';
import { IAdminAssessmentListDto } from '@/types/admin/assessment.type';
import SubmissionFilter from './components/SubmissionFilter';
import SubmissionTable from './components/SubmissionTable';
import ConfirmBulkDeleteModal from './modal/ConfirmBulkDeleteModal';

export default function SubmissionsModule() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_submission' });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [page, setPage] = useState(1);
  const size = 20;

  const { data: assessmentData } = useSearchAssessments(
    page,
    size,
    searchQuery || undefined,
    statusQuery || undefined
  );
  const deleteMutation = useDeleteAssessments();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteModal, setOpenBulkDeleteModal] = useState(false);

  const submissionList: IAdminAssessmentListDto[] = assessmentData?.result?.data || [];
  const totalElements: number = assessmentData?.result?.totalElements || 0;

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length > 0) {
      deleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          toast.success(t('delete.success', 'Đã xóa các bài làm được chọn.'));
          setOpenBulkDeleteModal(false);
          setSelectedIds([]);
        },
        onError: () => {
          toast.error(t('delete.error', 'Có lỗi xảy ra khi xóa bài làm.'));
        },
      });
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(submissionList.map((s) => s.id));
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
          {t('title', 'Danh sách Bài làm')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('subtitle', 'Quản lý toàn bộ bài làm của sinh viên')}
        </Typography>
      </Box>

      <SubmissionFilter
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        statusQuery={statusQuery}
        onStatusChange={(status) => {
          setStatusQuery(status);
          setPage(1);
        }}
        selectedCount={selectedIds.length}
        onBulkDeleteClick={() => setOpenBulkDeleteModal(true)}
      />

      <SubmissionTable
        data={submissionList}
        totalElements={totalElements}
        page={page}
        size={size}
        onPageChange={(newPage: number) => setPage(newPage)}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
      />

      {openBulkDeleteModal && (
        <ConfirmBulkDeleteModal
          open={openBulkDeleteModal}
          onClose={() => setOpenBulkDeleteModal(false)}
          onConfirm={handleConfirmBulkDelete}
          count={selectedIds.length}
        />
      )}
    </Box>
  );
}
