import { useMutation } from '@tanstack/react-query';
import { StudentApi } from '../student.api';

export const useReportResource = () => {
  return useMutation({
    mutationFn: ({ resourceId, reason }: { resourceId: number; reason: string }) => 
      StudentApi.reportResource(resourceId, reason),
  });
};
