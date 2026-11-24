'use client';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AuthCardLayout from '../components/AuthCardLayout';
import AuthForgotPassword from '../components/authForms/AuthForgotPassword';

export default function ForgotPasswordPage() {
  return (
    <AuthCardLayout>
      <PageMeta titleKey="authFlow.forgotPassword.pageTitle" descriptionKey="authFlow.forgotPassword.pageDescription" />
      <AuthForgotPassword />
    </AuthCardLayout>
  );
}
