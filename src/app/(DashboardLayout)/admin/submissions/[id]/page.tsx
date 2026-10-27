import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import { SubmissionDetailWrapper } from '@/modules/admin/submissions/detail/SubmissionDetailWrapper';

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!id) return null;
  return (
    <>
      <PageMeta
        titleKey="admin_submission.pageDetailTitle"
        descriptionKey="admin_submission.pageDetailDescription"
      />
      <SubmissionDetailWrapper id={id} />
    </>
  );
}
