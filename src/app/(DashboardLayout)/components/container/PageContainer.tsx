"use client";
// import { Helmet } from 'react-helmet';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import React from 'react';
import { t } from 'i18next';

type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

const PageContainer = ({ description, children, title }: Props) => (
  <HelmetProvider>
    <div>
      <Helmet>
        <title>
          {t('title')} - {title}
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="description" content={description} />
        <meta name="google" content="notranslate" />
      </Helmet>
      {children}
    </div>
  </HelmetProvider>
);

export default PageContainer;
