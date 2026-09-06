'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Stack, CircularProgress, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { IQuestionFilter } from '@/types/admin/question.type';
import { useQuestions } from '@/apis/question/hook';
import QuestionFilter from './components/QuestionFilter';
import QuestionTable from './components/QuestionTable';
import QuestionFormModal from './components/form/QuestionForm';
import ConfirmDeleteModal from './components/modal/ConfirmDeleteModal';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AIGenerationWidget from './components/ai/AIGenerationWidget';
import { IAIGenerateQuestionRequest } from '@/types/admin/question.type';
import { useGenerateQuestionAI } from '@/apis/question/hook/useGenerateQuestionAI';
import { useBulkDeleteQuestion } from '@/apis/question/hook/useBulkDeleteQuestion';
import ConfirmBulkDeleteModal from './components/modal/ConfirmBulkDeleteModal';

export default function QuestionBankPage() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question' });

  const [filter, setFilter] = useState<IQuestionFilter>({
    domainId: null,
    levelId: null,
    status: null,
    keyword: '',
    page: 0,
    size: 10,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const bulkDeleteMutation = useBulkDeleteQuestion();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  const { data, isLoading, isError } = useQuestions(filter);
  
  const generateAIMutation = useGenerateQuestionAI();
  const [aiTask, setAiTask] = useState<{ status: 'IDLE' | 'GENERATING' | 'SUCCESS' | 'ERROR', data?: any }>({ status: 'IDLE' });

  const handleStartAIGeneration = (requestData: IAIGenerateQuestionRequest) => {
    setAiTask({ status: 'GENERATING' });
    generateAIMutation.mutate(requestData, {
      onSuccess: (res) => {
        setAiTask({ 
          status: 'SUCCESS', 
          data: {
            ...res.result,
            originalDomainId: requestData.domainId,
            originalLevelId: requestData.levelId,
            originalType: requestData.type
          } 
        });
        const isDuplicate = res.result?.isDuplicate;
        if (isDuplicate) {
          toast.warning(t('ai.toastDuplicate'), { autoClose: 10000 });
        } else {
          toast.success(t('ai.toastSuccess'));
        }
      },
      onError: (err) => {
        setAiTask({ status: 'ERROR' });
        toast.error(t('ai.widgetError'));
      }
    });
  };

  const handleOpenAIForm = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleCloseAIWidget = () => {
    setAiTask({ status: 'IDLE', data: undefined });
  };

  const handleFilterChange = (newFilter: Partial<IQuestionFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter, page: 0 })); // Reset page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setFilter((prev) => ({ ...prev, page: newPage }));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (id: number) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleOpenDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data?.result?.content?.map((n) => n.id) || [];
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
    <PageContainer title={t('title')} description={t('description')}>
      <Box p={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} mb={1}>
              {t('title')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('description')}
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            {selectedIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Icon icon="solar:trash-bin-trash-bold" />}
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                Xóa {selectedIds.length} mục
              </Button>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Icon icon="solar:add-circle-bold" />}
              onClick={handleOpenAdd}
              sx={{ borderRadius: '8px', textTransform: 'none', px: 3, py: 1 }}
            >
              {t('newQuestion')}
            </Button>
          </Box>
        </Stack>

        <QuestionFilter filter={filter} onFilterChange={handleFilterChange} />

        <Box mt={3}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Alert severity="error">{t('form.error')}</Alert>
          ) : (
            <QuestionTable
              data={data?.result?.content || []}
              totalElements={data?.result?.totalElements || 0}
              page={filter.page || 0}
              size={filter.size || 10}
              onPageChange={handlePageChange}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectOne={handleSelectOne}
            />
          )}
        </Box>

        <QuestionFormModal
          open={isFormOpen}
          onClose={handleCloseForm}
          questionId={editingId}
          onAIGenerate={handleStartAIGeneration}
          aiGeneratedData={aiTask.status === 'SUCCESS' ? aiTask.data : null}
          onClearAIData={handleCloseAIWidget}
        />

        <ConfirmDeleteModal
          open={isDeleteOpen}
          onClose={handleCloseDelete}
          questionId={deleteId}
        />

        <ConfirmBulkDeleteModal
          open={isBulkDeleteOpen}
          onClose={() => setIsBulkDeleteOpen(false)}
          selectedIds={selectedIds}
          onSuccess={() => setSelectedIds([])}
        />

        <AIGenerationWidget 
          status={aiTask.status} 
          onClick={handleOpenAIForm} 
          onClose={handleCloseAIWidget} 
        />
      </Box>
    </PageContainer>
  );
}
