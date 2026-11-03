import { useQuery } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

const POLL_INTERVAL_MS = 3000;

export const useGetSourceDocument = (id: number) => {
  return useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.detail(id),
    queryFn: () => sourceDocumentApi.getSourceDocumentById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.result?.status;
      return status === 'PENDING' || status === 'PROCESSING' ? POLL_INTERVAL_MS : false;
    },
  });
};
