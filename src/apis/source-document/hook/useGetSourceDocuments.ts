import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';
import { ISourceDocument, ISourceDocumentFilter } from '@/types/admin/source-document.type';

const POLL_INTERVAL_MS = 3000;

const isBusy = (d: ISourceDocument) => d.status === 'PENDING' || d.status === 'PROCESSING';

export const useGetSourceDocuments = (filter: ISourceDocumentFilter) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.list(filter),
    queryFn: () => sourceDocumentApi.getSourceDocuments(filter),
    // Keep polling while a document is still being processed in the background
    refetchInterval: (query) => {
      const docs = query.state.data?.result?.data || [];
      return docs.some(isBusy) ? POLL_INTERVAL_MS : false;
    },
  });

  // Chunking finishes in the background, so no mutation invalidates the coverage cards:
  // refresh them when a document that was processing has settled.
  const docs = query.data?.result?.data;
  const prevBusyIds = useRef<Set<number>>(new Set());
  useEffect(() => {
    if (!docs) return;
    const settled = docs.some((d) => prevBusyIds.current.has(d.id) && !isBusy(d));
    if (settled) {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.coverage });
    }
    prevBusyIds.current = new Set(docs.filter(isBusy).map((d) => d.id));
  }, [docs, queryClient]);

  return query;
};
