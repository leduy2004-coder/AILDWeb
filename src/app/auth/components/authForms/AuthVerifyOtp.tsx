'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useResendOtp, useVerifyOtp } from '@/apis/auth';
import { showErrorToast, showSuccessToast } from '@/modules/shared/components/toasts/ToastHelper';
import OtpInput from '../OtpInput';
import {
  AUTH_PATH,
  getAuthErrorCode,
  getAuthErrorKey,
  OTP_EXPIRE_SECONDS,
  OTP_LENGTH,
  otpSentAtStorageKey,
  readOtpSentAt,
  rememberOtpSent,
  RESEND_COOLDOWN_SECONDS,
} from '../../constants/auth-flow.constant';

const OTP_EXPIRED_CODES = [1022, 1024];
const REGISTRATION_EXPIRED_CODE = 1026;

const emptyOtp = () => Array<string>(OTP_LENGTH).fill('');

const formatCountdown = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

/** Step 2 of sign-up: confirm the email with the 6-digit code it received */
export default function AuthVerifyOtp() {
  const { t } = useTranslation();
  const router = useRouter();
  const email = (useSearchParams().get('email') ?? '').trim();

  const [digits, setDigits] = useState<string[]>(emptyOtp);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [registrationExpired, setRegistrationExpired] = useState(false);
  // Null until mounted: the send time lives in sessionStorage, which the server render cannot read
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const verifyMutation = useVerifyOtp();
  const resendMutation = useResendOtp();

  useEffect(() => {
    if (email) setSentAt(readOtpSentAt(email));
  }, [email]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = sentAt === null ? 0 : Math.floor((now - sentAt) / 1000);
  const expireLeft = Math.max(0, OTP_EXPIRE_SECONDS - elapsed);
  const resendLeft = Math.max(0, RESEND_COOLDOWN_SECONDS - elapsed);
  const isExpired = sentAt !== null && expireLeft === 0;

  const submit = (code: string) => {
    if (verifyMutation.isPending) return;
    if (code.length < OTP_LENGTH) {
      setErrorKey('authFlow.verifyOtp.otpRequired');
      return;
    }
    setErrorKey(null);
    verifyMutation.mutate(
      { email, otp: code, status: 'REGISTER' },
      {
        onSuccess: (res) => {
          if (res.result) {
            try {
              sessionStorage.removeItem(otpSentAtStorageKey(email));
            } catch {
              // nothing to clean up
            }
            showSuccessToast(t('authFlow.common.successTitle'), t('authFlow.verifyOtp.success'));
            router.push(AUTH_PATH.LOGIN);
            return;
          }
          setErrorKey('authFlow.verifyOtp.wrongOtp');
          setDigits(emptyOtp());
        },
        onError: (error) => {
          const code = getAuthErrorCode(error);
          if (code === REGISTRATION_EXPIRED_CODE) setRegistrationExpired(true);
          if (code !== undefined && OTP_EXPIRED_CODES.includes(code)) {
            // The server dropped the code: show the expired state so the user resends
            setSentAt(Date.now() - OTP_EXPIRE_SECONDS * 1000);
          }
          setErrorKey(getAuthErrorKey(error));
          setDigits(emptyOtp());
        },
      },
    );
  };

  const handleResend = () => {
    resendMutation.mutate(
      { email, status: 'REGISTER' },
      {
        onSuccess: () => {
          rememberOtpSent(email);
          setSentAt(Date.now());
          setNow(Date.now());
          setDigits(emptyOtp());
          setErrorKey(null);
          showSuccessToast(t('authFlow.common.successTitle'), t('authFlow.verifyOtp.resent'));
        },
        onError: (error) => {
          if (getAuthErrorCode(error) === REGISTRATION_EXPIRED_CODE) setRegistrationExpired(true);
          showErrorToast(t('authFlow.common.errorTitle'), t(getAuthErrorKey(error)));
        },
      },
    );
  };

  if (!email || registrationExpired) {
    return (
      <Box textAlign="center">
        <Typography variant="h4" fontWeight={700} mb={2}>
          {t('authFlow.verifyOtp.title')}
        </Typography>
        <Typography color="text.secondary" mb={3}>
          {t(registrationExpired ? 'authFlow.errors.registrationExpired' : 'authFlow.verifyOtp.missingEmail')}
        </Typography>
        <Button component={Link} href={AUTH_PATH.REGISTER} variant="contained" sx={{ borderRadius: '25px', px: 4 }}>
          {t('authFlow.verifyOtp.backToRegister')}
        </Button>
      </Box>
    );
  }

  return (
    <Box textAlign="center">
      <Typography variant="h3" fontWeight={700} mb={1} sx={{ fontSize: { xs: '24px', sm: '28px' } }}>
        {t('authFlow.verifyOtp.title')}
      </Typography>
      <Typography color="text.secondary">{t('authFlow.verifyOtp.subtitle')}</Typography>
      <Typography fontWeight={600} mb={3} sx={{ wordBreak: 'break-all' }}>
        {email}
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(digits.join(''));
        }}
      >
        <Stack spacing={2}>
          <OtpInput
            value={digits}
            onChange={(next) => {
              setDigits(next);
              if (errorKey) setErrorKey(null);
            }}
            onComplete={submit}
            disabled={verifyMutation.isPending || isExpired}
            error={Boolean(errorKey)}
          />

          {errorKey && (
            <Typography color="error" fontSize={14}>
              {t(errorKey)}
            </Typography>
          )}

          {sentAt !== null && (
            <Typography fontSize={14} color={isExpired ? 'error' : 'text.secondary'}>
              {isExpired
                ? t('authFlow.verifyOtp.expired')
                : t('authFlow.verifyOtp.expiresIn', { time: formatCountdown(expireLeft) })}
            </Typography>
          )}

          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={verifyMutation.isPending}
            disabled={isExpired}
            sx={{ py: 1.5, borderRadius: '25px', textTransform: 'none', fontSize: '16px', fontWeight: 600 }}
          >
            {t('authFlow.verifyOtp.submit')}
          </LoadingButton>
        </Stack>
      </form>

      <Box mt={3}>
        <Typography component="span" color="text.secondary" fontSize={14}>
          {t('authFlow.verifyOtp.didNotReceive')}{' '}
        </Typography>
        <LoadingButton
          variant="text"
          size="small"
          onClick={handleResend}
          loading={resendMutation.isPending}
          disabled={resendLeft > 0}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: 14 }}
        >
          {resendLeft > 0
            ? t('authFlow.verifyOtp.resendIn', { seconds: resendLeft })
            : t('authFlow.verifyOtp.resend')}
        </LoadingButton>
      </Box>

      <Typography
        component={Link}
        href={AUTH_PATH.LOGIN}
        display="block"
        mt={2}
        fontSize={14}
        fontWeight={500}
        sx={{ textDecoration: 'none', color: 'primary.main' }}
      >
        {t('authFlow.common.backToLogin')}
      </Typography>
    </Box>
  );
}
