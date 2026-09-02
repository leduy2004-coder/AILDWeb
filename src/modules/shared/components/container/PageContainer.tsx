"use client";
import { ReactNode } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

type Props = {
  description?: string;
  children: ReactNode;
  title?: string | number | null;
};
export const PageContainer = ({ title, description, children }: Props) => {
  const { t } = useTranslation();
  const baseTitle = t('title') ?? '';
  const normalizedTitle =
    typeof title === 'string' || typeof title === 'number' ? String(title) : '';
  const helmetTitle = normalizedTitle
    ? `${baseTitle} - ${normalizedTitle}`
    : baseTitle;
  const normalizedDescription =
    typeof description === 'string' || typeof description === 'number'
      ? String(description)
      : '';
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>{helmetTitle}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          <meta name="description" content={normalizedDescription} />
          <meta name="google" content="notranslate" />
        </Helmet>
        {children}
      </div>
    </HelmetProvider>
  );
};
