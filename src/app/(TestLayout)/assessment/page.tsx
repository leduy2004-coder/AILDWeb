import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AssessmentPageClient from '@/modules/public/assessment/AssessmentPageClient';

export default function AssessmentPage() {
  return (
    <>
      <PageMeta titleKey="assessment.pageTitle" descriptionKey="assessment.pageDescription" />
      <AssessmentPageClient />
    </>
  );
}
