import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AdminConfigPage from '@/modules/admin/config';

export default function Page() {
  return (
    <>
      <PageMeta titleKey="admin_configs.pageTitle" descriptionKey="admin_configs.pageDescription" />
      <AdminConfigPage />
    </>
  );
}
