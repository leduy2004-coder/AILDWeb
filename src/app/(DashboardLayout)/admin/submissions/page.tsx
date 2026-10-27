import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import SubmissionsModule from '@/modules/admin/submissions';

export default function SubmissionsPage() {
  return (
    <>
      <PageMeta titleKey="admin_submission.pageTitle" descriptionKey="admin_submission.pageDescription" />
      <SubmissionsModule />
    </>
  );
}
