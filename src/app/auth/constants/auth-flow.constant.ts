import { HttpError } from '@/lib/http';

export const OTP_LENGTH = 6;
/** Must match expiration-OTP in auth-service config (5 minutes) */
export const OTP_EXPIRE_SECONDS = 5 * 60;
/** Must match mail-resend-cooldown in auth-service config */
export const RESEND_COOLDOWN_SECONDS = 60;
/** Must match expiration-reset-password in auth-service config */
export const RESET_LINK_EXPIRE_MINUTES = 15;
export const MIN_PASSWORD_LENGTH = 8;

/** sessionStorage key holding when the last OTP was mailed to an email, so a page reload keeps the countdown */
export const otpSentAtStorageKey = (email: string) => `otpSentAt:${email.toLowerCase()}`;

export const AUTH_PATH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
};

/** auth-service ErrorCode values the sign-up / reset pages react to */
const AUTH_ERROR_KEY: Record<number, string> = {
  1002: 'authFlow.errors.userExisted',
  1006: 'authFlow.errors.userNotExisted',
  1008: 'authFlow.errors.adminNotAllowed',
  1022: 'authFlow.errors.otpExpired',
  1024: 'authFlow.errors.tooManyAttempts',
  1025: 'authFlow.errors.resendTooSoon',
  1026: 'authFlow.errors.registrationExpired',
  1027: 'authFlow.errors.resetTokenInvalid',
  1856: 'authFlow.errors.invalidRequest',
};

export const getAuthErrorCode = (error: unknown): number | undefined =>
  error instanceof HttpError ? Number(error.payload?.code) : undefined;

/** i18n key for an error thrown by an auth API call */
export const getAuthErrorKey = (error: unknown, fallbackKey = 'authFlow.errors.generic'): string => {
  const code = getAuthErrorCode(error);
  return (code && AUTH_ERROR_KEY[code]) || fallbackKey;
};

export const rememberOtpSent = (email: string) => {
  try {
    sessionStorage.setItem(otpSentAtStorageKey(email), String(Date.now()));
  } catch {
    // Storage blocked: the countdown just restarts on reload
  }
};

export const readOtpSentAt = (email: string): number => {
  try {
    const saved = Number(sessionStorage.getItem(otpSentAtStorageKey(email)));
    if (saved > 0) return saved;
  } catch {
    // fall through
  }
  return Date.now();
};
