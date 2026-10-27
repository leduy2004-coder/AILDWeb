import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AdminOverviewModule from '@/modules/admin/overview';

export default function AdminOverviewPage() {
  return (
    <>
      <PageMeta titleKey="admin_overview.pageTitle" descriptionKey="admin_overview.pageDescription" />
      <AdminOverviewModule />
    </>
  );
}
