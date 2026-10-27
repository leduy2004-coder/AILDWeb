import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import ProfileModule from '@/modules/public/profile';

export default function ProfilePage() {
  return (
    <>
      <PageMeta titleKey="profile.pageTitle" descriptionKey="profile.pageDescription" />
      <ProfileModule />
    </>
  );
}
