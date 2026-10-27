import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import ResourceModule from '@/modules/admin/resource';

export default function ResourcesPage() {
  return (
    <>
      <PageMeta titleKey="admin_resource.pageTitle" descriptionKey="admin_resource.pageDescription" />
      <ResourceModule />
    </>
  );
}
