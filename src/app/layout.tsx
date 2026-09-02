import type { Viewport } from 'next';
import { Providers } from '@/store/provider';

import React from 'react';
import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext';
import FontWrapper from './FontWrapper';
import AppContainer from './AppContainer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google" content="notranslate" />
        <title>{'TutorHub_LD'}</title>
      </head>
      <FontWrapper>
        <Providers>
          <UnsavedChangesProvider>
            <AppContainer>{children}</AppContainer>
          </UnsavedChangesProvider>
        </Providers>
      </FontWrapper>
    </html>
  );
}
