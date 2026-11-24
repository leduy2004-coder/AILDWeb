'use client';
import { Suspense } from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AuthCardLayout from '../components/AuthCardLayout';
import AuthVerifyOtp from '../components/authForms/AuthVerifyOtp';

export default function VerifyOtpPage() {
  return (
    <AuthCardLayout>
      <PageMeta titleKey="authFlow.verifyOtp.pageTitle" descriptionKey="authFlow.verifyOtp.pageDescription" />
      {/* AuthVerifyOtp reads ?email= with useSearchParams, which needs a Suspense boundary */}
      <Suspense>
        <AuthVerifyOtp />
      </Suspense>
    </AuthCardLayout>
  );
}
