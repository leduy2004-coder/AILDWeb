import { useMutation } from '@tanstack/react-query';
import { StudentApi } from '../student.api';

export const useToggleResourceLike = () => {
  return useMutation({
    mutationFn: (resourceId: number) => StudentApi.toggleResourceLike(resourceId),
  });
};
