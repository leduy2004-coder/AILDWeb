import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

export const useDeleteSourceDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sourceDocumentApi.deleteSourceDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.all });
    },
  });
};
