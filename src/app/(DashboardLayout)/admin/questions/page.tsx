import React, { Suspense } from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import QuestionBankPage from '@/modules/admin/question';

export default function Page() {
  return (
    <>
      <PageMeta titleKey="admin_question.pageTitle" descriptionKey="admin_question.pageDescription" />
      {/* QuestionBankPage reads ?edit= with useSearchParams, which needs a Suspense boundary */}
      <Suspense>
        <QuestionBankPage />
      </Suspense>
    </>
  );
}
