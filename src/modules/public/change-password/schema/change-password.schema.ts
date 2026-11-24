import * as yup from 'yup';
import { MIN_PASSWORD_LENGTH } from '@/app/auth/constants/auth-flow.constant';

// Messages are i18n keys: the form wraps them with t()
export const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('changePassword.validation.currentRequired'),
  newPassword: yup
    .string()
    .required('register.step1.passwordRequired')
    .min(MIN_PASSWORD_LENGTH, 'register.step1.passwordMinLength')
    .notOneOf([yup.ref('currentPassword')], 'changePassword.validation.sameAsCurrent'),
  confirmPassword: yup
    .string()
    .required('register.step1.confirmPasswordRequired')
    .oneOf([yup.ref('newPassword')], 'register.step1.passwordMismatch'),
});

export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

export const CHANGE_PASSWORD_DEFAULT_VALUES: ChangePasswordFormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};
