import { useMutation } from '@tanstack/react-query';
import { uploadFile } from '../file.api';
import { MediaFileDto } from '@/types/file/file.type';
import { IApiResponse } from '@/types/shared';

export function useUploadFile() {
  return useMutation<IApiResponse<MediaFileDto>, Error, File>({
    mutationFn: (file: File) => uploadFile(file),
  });
}
