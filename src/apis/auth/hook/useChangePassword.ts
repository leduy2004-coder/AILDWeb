import { useMutation } from '@tanstack/react-query';
import { changePassword, IChangePasswordBody } from '../auth.api';

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: IChangePasswordBody) => changePassword(body),
  });
}
