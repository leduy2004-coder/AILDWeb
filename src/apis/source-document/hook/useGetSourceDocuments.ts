import { useQuery } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';
import { ISourceDocumentFilter } from '@/types/admin/source-document.type';

const POLL_INTERVAL_MS = 3000;

export const useGetSourceDocuments = (filter: ISourceDocumentFilter) => {
  return useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.list(filter),
    queryFn: () => sourceDocumentApi.getSourceDocuments(filter),
    // Keep polling while a document is still being processed in the background
    refetchInterval: (query) => {
      const docs = query.state.data?.result?.data || [];
      return docs.some((d) => d.status === 'PENDING' || d.status === 'PROCESSING') ? POLL_INTERVAL_MS : false;
    },
  });
};
