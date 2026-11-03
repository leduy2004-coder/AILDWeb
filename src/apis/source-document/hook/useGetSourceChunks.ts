import { useQuery } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';
import { ISourceChunkFilter } from '@/types/admin/source-document.type';

export const useGetSourceChunks = (filter: ISourceChunkFilter) => {
  return useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.chunks(filter),
    queryFn: () => sourceDocumentApi.getSourceChunks(filter),
    enabled: !!filter.documentId,
  });
};
