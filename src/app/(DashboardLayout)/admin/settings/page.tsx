import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import AdminSettingsModule from '@/modules/admin/settings';

export default function AdminSettingsPage() {
  return (
    <>
      <PageMeta titleKey="admin_settings.pageTitle" descriptionKey="admin_settings.pageDescription" />
      <AdminSettingsModule />
    </>
  );
}
