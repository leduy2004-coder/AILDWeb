'use client';
import { Suspense } from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AuthCardLayout from '../components/AuthCardLayout';
import AuthResetPassword from '../components/authForms/AuthResetPassword';

export default function ResetPasswordPage() {
  return (
    <AuthCardLayout>
      <PageMeta titleKey="authFlow.resetPassword.pageTitle" descriptionKey="authFlow.resetPassword.pageDescription" />
      {/* AuthResetPassword reads ?token= with useSearchParams, which needs a Suspense boundary */}
      <Suspense>
        <AuthResetPassword />
      </Suspense>
    </AuthCardLayout>
  );
}
