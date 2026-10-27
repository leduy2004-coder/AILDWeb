import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import UserModule from '@/modules/admin/user';

export default function UsersPage() {
  return (
    <>
      <PageMeta titleKey="admin_user.pageTitle" descriptionKey="admin_user.pageDescription" />
      <UserModule />
    </>
  );
}
