import { useQuery } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

export const useGetSourceCoverage = () => {
  return useQuery({
    queryKey: SOURCE_DOCUMENT_QUERY_KEYS.coverage,
    queryFn: () => sourceDocumentApi.getSourceCoverage(),
  });
};
