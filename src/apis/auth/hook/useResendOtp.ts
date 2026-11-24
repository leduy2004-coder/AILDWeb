import { useMutation } from '@tanstack/react-query';
import { OtpPurpose, resendOtp } from '../auth.api';

export function useResendOtp() {
  return useMutation({
    mutationFn: ({ email, status }: { email: string; status: OtpPurpose }) => resendOtp(email, status),
  });
}
