import React, { Suspense } from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import SubmissionsModule from '@/modules/admin/submissions';

export default function SubmissionsPage() {
  return (
    <>
      <PageMeta titleKey="admin_submission.pageTitle" descriptionKey="admin_submission.pageDescription" />
      {/* SubmissionsModule reads ?status= and ?sort= with useSearchParams, which needs a Suspense boundary */}
      <Suspense>
        <SubmissionsModule />
      </Suspense>
    </>
  );
}
