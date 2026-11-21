import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

const POLL_INTERVAL_MS = 3000;

export const useGetSourceDocument = (id: number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.detail(id),
    queryFn: () => sourceDocumentApi.getSourceDocumentById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.result?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL_MS : false;
    },
  });

  // When background processing settles, the chunk table and coverage cards are stale: refetch them.
  const status = query.data?.result?.status;
  const wasBusy = useRef(false);
  useEffect(() => {
    if (!status) return;
    const busy = status === 'PENDING' || status === 'PROCESSING';
    if (wasBusy.current && !busy) {
      queryClient.invalidateQueries({ queryKey: [...SOURCE_DOCUMENT_QUERY_KEYS.all, 'chunks'] });
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.coverage });
    }
    wasBusy.current = busy;
  }, [status, queryClient]);

  return query;
};
