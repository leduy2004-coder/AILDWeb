import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import SourceDocumentModule from '@/modules/admin/source-document';

export default function SourceDocumentsPage() {
  return (
    <>
      <PageMeta titleKey="admin_source_document.pageTitle" descriptionKey="admin_source_document.pageDescription" />
      <SourceDocumentModule />
    </>
  );
}
