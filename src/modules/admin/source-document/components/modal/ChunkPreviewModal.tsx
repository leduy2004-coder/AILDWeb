import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Box, Chip } from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ISourceChunk } from '@/types/admin/source-document.type';
import { CHUNK_STATUS_COLOR } from '../../constant/source-document.constant';
import { formatPages } from '../table/ChunkTable';

interface Props {
  open: boolean;
  onClose: () => void;
  chunk: ISourceChunk;
}

export default function ChunkPreviewModal({ open, onClose, chunk }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });

  const domainLabel = (domainId?: number) => (domainId ? tDomain(domainId.toString()) : t('chunkTable.noLabel'));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {t('preview.title', { index: chunk.chunkIndex + 1, pages: formatPages(chunk.pageFrom, chunk.pageTo) })}
        </Typography>
        <IconButton onClick={onClose} size="small"><IconX /></IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Chip size="small" color={CHUNK_STATUS_COLOR[chunk.status]} label={t(`chunkStatus.${chunk.status}`)} />
          <Chip size="small" variant="outlined" label={t('preview.words', { count: chunk.wordCount ?? 0 })} />
        </Box>
        <Box display="flex" flexDirection="column" gap={0.5} mb={2}>
          <Typography variant="body2">
            <b>{t('preview.label')}:</b> {domainLabel(chunk.domainId)}
            {chunk.labelSource ? ` (${t(`labelSource.${chunk.labelSource}`)})` : ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <b>{t('preview.suggestion')}:</b> {domainLabel(chunk.suggestedDomainId)}
            {chunk.suggestConfidence !== undefined && chunk.suggestConfidence !== null
              ? ` — ${t('chunkTable.confidence')} ${Number(chunk.suggestConfidence).toFixed(2)}`
              : ''}
          </Typography>
        </Box>
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, whiteSpace: 'pre-wrap' }}>
          <Typography variant="body2">{chunk.content}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t('preview.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
