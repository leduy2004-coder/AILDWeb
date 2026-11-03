import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';

export const useIgnoreSourceChunks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (chunkIds: number[]) => sourceDocumentApi.ignoreSourceChunks(chunkIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.all });
    },
  });
};
