import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sourceDocumentApi, SOURCE_DOCUMENT_QUERY_KEYS } from '../source-document.api';
import { ISourceChunkLabelRequest } from '@/types/admin/source-document.type';

export const useLabelSourceChunks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ISourceChunkLabelRequest) => sourceDocumentApi.labelSourceChunks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SOURCE_DOCUMENT_QUERY_KEYS.all });
    },
  });
};
