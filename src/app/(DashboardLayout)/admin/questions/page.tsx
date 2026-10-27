import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import QuestionBankPage from '@/modules/admin/question';

export default function Page() {
  return (
    <>
      <PageMeta titleKey="admin_question.pageTitle" descriptionKey="admin_question.pageDescription" />
      <QuestionBankPage />
    </>
  );
}
