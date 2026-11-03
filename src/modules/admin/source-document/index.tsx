'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, InputAdornment, FormControl, Select, MenuItem } from '@mui/material';
import { IconSearch, IconUpload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import { useGetSourceDocuments, useDeleteSourceDocument, useReprocessSourceDocument } from '@/apis/source-document/hook';
import { ISourceDocument } from '@/types/admin/source-document.type';

import CoverageMatrix from './components/CoverageMatrix';
import DocumentTable from './components/table/DocumentTable';
import UploadDocumentForm from './components/form/UploadDocumentForm';
import ConfirmDeleteDocumentModal from './components/modal/ConfirmDeleteDocumentModal';
import { DOCUMENT_STATUSES } from './constant/source-document.constant';

export default function SourceDocumentModule() {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const size = 10;

  const { data } = useGetSourceDocuments({ keyword, status, page, size });
  const deleteMutation = useDeleteSourceDocument();
  const reprocessMutation = useReprocessSourceDocument();

  const [openUpload, setOpenUpload] = useState(false);
  const [docToDelete, setDocToDelete] = useState<ISourceDocument | null>(null);

  const handleReprocess = (doc: ISourceDocument) => {
    reprocessMutation.mutate(doc.id, {
      onSuccess: () => toast.success(t('reprocess.success')),
      onError: () => toast.error(t('reprocess.error')),
    });
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    deleteMutation.mutate(docToDelete.id, {
      onSuccess: () => {
        toast.success(t('delete.success'));
        setDocToDelete(null);
      },
      onError: () => toast.error(t('delete.error')),
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>{t('title')}</Typography>
          <Typography variant="body1" color="text.secondary">{t('subtitle')}</Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<IconUpload />} onClick={() => setOpenUpload(true)}>
          {t('uploadButton')}
        </Button>
      </Box>

      <CoverageMatrix />

      <Box display="flex" gap={2} mb={3} alignItems="center" flexWrap="wrap">
        <TextField
          placeholder={t('filter.searchPlaceholder')}
          size="small"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconSearch size={18} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300, flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            displayEmpty
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">{t('filter.allStatuses')}</MenuItem>
            {DOCUMENT_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <DocumentTable
        data={data?.result?.data || []}
        onView={(doc) => router.push(`/admin/source-documents/${doc.id}`)}
        onReprocess={handleReprocess}
        onDelete={setDocToDelete}
        totalElements={data?.result?.totalElements || 0}
        page={page}
        size={size}
        onPageChange={setPage}
      />

      {openUpload && <UploadDocumentForm open={openUpload} onClose={() => setOpenUpload(false)} />}

      {docToDelete && (
        <ConfirmDeleteDocumentModal
          open={!!docToDelete}
          onClose={() => setDocToDelete(null)}
          onConfirm={handleConfirmDelete}
          title={docToDelete.title}
          loading={deleteMutation.isPending}
        />
      )}
    </Box>
  );
}
