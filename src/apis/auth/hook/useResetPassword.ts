import { useMutation, useQuery } from '@tanstack/react-query';
import { IResetPasswordBody, resetPassword, validateResetToken } from '../auth.api';

export const RESET_PASSWORD_QUERY_KEYS = {
  validate: (token: string) => ['auth', 'reset-password', 'validate', token] as const,
};

/** Whether the link from the forgot-password email can still be used */
export function useValidateResetToken(token: string | null) {
  return useQuery({
    queryKey: RESET_PASSWORD_QUERY_KEYS.validate(token ?? ''),
    queryFn: () => validateResetToken(token as string),
    enabled: Boolean(token),
    retry: false,
    refetchOnWindowFocus: false,
    select: (res) => Boolean(res.result),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (body: IResetPasswordBody) => resetPassword(body),
  });
}
