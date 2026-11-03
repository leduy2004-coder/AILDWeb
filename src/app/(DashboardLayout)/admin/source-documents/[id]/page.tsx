import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import { SourceDocumentDetailWrapper } from '@/modules/admin/source-document/detail/SourceDocumentDetailWrapper';

export default async function SourceDocumentDetailPage({
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
        titleKey="admin_source_document.pageDetailTitle"
        descriptionKey="admin_source_document.pageDetailDescription"
      />
      <SourceDocumentDetailWrapper id={id} />
    </>
  );
}
