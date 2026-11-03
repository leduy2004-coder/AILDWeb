import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

export const useRestoreSourceChunks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chunkIds: number[]) => sourceDocumentApi.restoreSourceChunks(chunkIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.all });
    },
  });
};
