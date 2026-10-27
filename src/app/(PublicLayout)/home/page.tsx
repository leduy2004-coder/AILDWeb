import React from 'react';
import { PageMeta } from '@/modules/shared/components/container/PageMeta';
import HomePageClient from '@/modules/public/home/HomePageClient';

export default function HomePage() {
  return (
    <>
      <PageMeta titleKey="home.pageTitle" descriptionKey="home.pageDescription" />
      <HomePageClient />
    </>
  );
}
