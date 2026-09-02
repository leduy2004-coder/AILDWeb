import { useQuery } from '@tanstack/react-query';
import { getFileByUuid } from '../file.api';

export const GET_FILE_BY_UUID_QUERY_KEY = 'GET_FILE_BY_UUID';

export function useGetFileByUuid(uuid?: string | null) {
  return useQuery({
    queryKey: [GET_FILE_BY_UUID_QUERY_KEY, uuid],
    queryFn: () => getFileByUuid(uuid!),
    enabled: !!uuid,
    staleTime: 10 * 60 * 1000, // 10 minutes cache since files rarely change their UUID content
  });
}
