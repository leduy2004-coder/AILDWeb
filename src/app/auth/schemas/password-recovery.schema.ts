import * as yup from 'yup';
import { MIN_PASSWORD_LENGTH } from '../constants/auth-flow.constant';

// Messages are i18n keys: the components wrap them with t()

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required('register.step1.emailRequired')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'register.step1.emailInvalid'),
});

export type ForgotPasswordSchema = yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required('register.step1.passwordRequired')
    .min(MIN_PASSWORD_LENGTH, 'register.step1.passwordMinLength'),
  confirmPassword: yup
    .string()
    .required('register.step1.confirmPasswordRequired')
    .oneOf([yup.ref('newPassword')], 'register.step1.passwordMismatch'),
});

export type ResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>;
