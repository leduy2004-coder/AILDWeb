import React, { useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { ISourcePassage } from '@/types/admin/source-document.type';

interface Props {
  passages: ISourcePassage[];
}

const formatPages = (from?: number, to?: number) => {
  if (!from) return '';
  return to && to !== from ? `${from}-${to}` : `${from}`;
};

/** Source passages an AI draft was grounded on, so the admin can check the question against the original text. */
export default function SourcePassagesPanel({ passages }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_question.sources' });
  const [expanded, setExpanded] = useState<number | false>(passages[0]?.chunkId ?? false);

  if (passages.length === 0) return null;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Icon icon="solar:document-text-bold-duotone" width={20} />
        <Typography variant="subtitle2" fontWeight={600}>{t('title')}</Typography>
        <Chip size="small" label={passages.length} />
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
        {t('hint')}
      </Typography>
      {passages.map((p) => (
        <Accordion
          key={p.chunkId}
          disableGutters
          variant="outlined"
          expanded={expanded === p.chunkId}
          onChange={(_, isOpen) => setExpanded(isOpen ? p.chunkId : false)}
        >
          <AccordionSummary expandIcon={<Icon icon="solar:alt-arrow-down-linear" />}>
            <Typography variant="body2" fontWeight={500}>
              {p.documentTitle || t('unknownDocument')}
              {p.pageFrom ? ` — ${t('page', { pages: formatPages(p.pageFrom, p.pageTo) })}` : ''}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ bgcolor: 'grey.50' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{p.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
