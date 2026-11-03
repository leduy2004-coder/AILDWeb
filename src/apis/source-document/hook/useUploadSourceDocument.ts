import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';
import { ISourceDocumentUploadRequest } from '@/types/admin/source-document.type';

export const useUploadSourceDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ISourceDocumentUploadRequest) => sourceDocumentApi.uploadSourceDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.all });
    },
  });
};
