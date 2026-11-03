'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Chip, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconTag, IconEyeOff, IconRestore } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

import {
  useGetSourceDocument,
  useGetSourceChunks,
  useIgnoreSourceChunks,
  useRestoreSourceChunks,
} from '@/apis/source-document/hook';
import { ISourceChunk } from '@/types/admin/source-document.type';

import ChunkFilter, { ChunkFilterValue, EMPTY_CHUNK_FILTER } from '../components/ChunkFilter';
import ChunkTable from '../components/table/ChunkTable';
import BulkLabelForm from '../components/form/BulkLabelForm';
import ChunkPreviewModal from '../components/modal/ChunkPreviewModal';
import { DOCUMENT_STATUS_COLOR } from '../constant/source-document.constant';

interface Props {
  id: number;
}

export default function SourceDocumentDetailModule({ id }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const router = useRouter();

  const [filter, setFilter] = useState<ChunkFilterValue>(EMPTY_CHUNK_FILTER);
  const [page, setPage] = useState(1);
  const size = 20;
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openLabel, setOpenLabel] = useState(false);
  const [previewChunk, setPreviewChunk] = useState<ISourceChunk | null>(null);

  const { data: docData, isLoading } = useGetSourceDocument(id);
  const { data: chunkData } = useGetSourceChunks({ documentId: id, ...filter, page, size });
  const ignoreMutation = useIgnoreSourceChunks();
  const restoreMutation = useRestoreSourceChunks();

  const doc = docData?.result;
  const chunks = chunkData?.result?.data || [];

  const handleFilterChange = (value: ChunkFilterValue) => {
    setFilter(value);
    setPage(1);
    setSelectedIds([]);
  };

  const handleSelectOne = (chunkId: number) => {
    setSelectedIds((prev) => (prev.includes(chunkId) ? prev.filter((x) => x !== chunkId) : [...prev, chunkId]));
  };

  const handleIgnore = () => {
    ignoreMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(t('bulk.ignoreSuccess', { count: selectedIds.length }));
        setSelectedIds([]);
      },
      onError: () => toast.error(t('bulk.error')),
    });
  };

  const handleRestore = () => {
    restoreMutation.mutate(selectedIds, {
      onSuccess: () => {
        toast.success(t('bulk.restoreSuccess', { count: selectedIds.length }));
        setSelectedIds([]);
      },
      onError: () => toast.error(t('bulk.error')),
    });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (!doc) {
    return (
      <Box>
        <Typography>{t('detail.notFound')}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin/source-documents')} sx={{ mt: 2 }}>
          {t('detail.back')}
        </Button>
      </Box>
    );
  }

  const busy = doc.status === 'PENDING' || doc.status === 'PROCESSING';

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/admin/source-documents')} color="inherit" sx={{ mb: 2 }}>
        {t('detail.back')}
      </Button>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} gap={2} flexWrap="wrap">
        <Box>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <Typography variant="h4" fontWeight={700}>{doc.title}</Typography>
            <Chip label={t(`status.${doc.status}`)} size="small" color={DOCUMENT_STATUS_COLOR[doc.status]} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {[doc.sourceName, doc.publishedYear, doc.fileName, doc.pageCount ? t('detail.pages', { count: doc.pageCount }) : null]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Chip color="success" variant="outlined" label={t('table.activeCount', { count: doc.activeChunkCount })} />
          <Chip color="warning" variant="outlined" label={t('table.unlabeledCount', { count: doc.unlabeledChunkCount })} />
          <Chip variant="outlined" label={t('table.ignoredCount', { count: doc.ignoredChunkCount })} />
        </Box>
      </Box>

      {busy && <Alert severity="info" sx={{ mb: 3 }}>{t('detail.processing')}</Alert>}
      {doc.status === 'FAILED' && (
        <Alert severity="error" sx={{ mb: 3 }}>{t('detail.failed', { message: doc.errorMessage || '' })}</Alert>
      )}
      <Alert severity="success" icon={false} sx={{ mb: 3 }}>{t('detail.hint')}</Alert>

      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <ChunkFilter filter={filter} onFilterChange={handleFilterChange} />
        {selectedIds.length > 0 && (
          <Box display="flex" gap={1} mb={3}>
            <Button variant="contained" size="small" startIcon={<IconTag size={18} />} onClick={() => setOpenLabel(true)}>
              {t('bulk.label', { count: selectedIds.length })}
            </Button>
            <Button variant="outlined" size="small" color="inherit" startIcon={<IconEyeOff size={18} />} onClick={handleIgnore} disabled={ignoreMutation.isPending}>
              {t('bulk.ignore')}
            </Button>
            <Button variant="outlined" size="small" startIcon={<IconRestore size={18} />} onClick={handleRestore} disabled={restoreMutation.isPending}>
              {t('bulk.restore')}
            </Button>
          </Box>
        )}
      </Box>

      <ChunkTable
        data={chunks}
        onPreview={setPreviewChunk}
        totalElements={chunkData?.result?.totalElements || 0}
        page={page}
        size={size}
        onPageChange={(newPage) => {
          setPage(newPage);
          setSelectedIds([]);
        }}
        selectedIds={selectedIds}
        onSelectAll={(checked) => setSelectedIds(checked ? chunks.map((c) => c.id) : [])}
        onSelectOne={handleSelectOne}
      />

      {openLabel && (
        <BulkLabelForm open={openLabel} onClose={() => setOpenLabel(false)} chunkIds={selectedIds} onSuccess={() => setSelectedIds([])} />
      )}

      {previewChunk && <ChunkPreviewModal open={!!previewChunk} onClose={() => setPreviewChunk(null)} chunk={previewChunk} />}
    </Box>
  );
}
