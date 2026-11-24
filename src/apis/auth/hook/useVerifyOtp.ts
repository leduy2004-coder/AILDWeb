import { useMutation } from '@tanstack/react-query';
import { IVerifyOtpBody, verifyOtp } from '../auth.api';

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (body: IVerifyOtpBody) => verifyOtp(body),
  });
}
