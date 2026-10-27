"use client";
import React from 'react';

type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
};

// Tab title/description are rendered by PageMeta (i18n-aware), not here
const PageContainer = ({ children }: Props) => <div>{children}</div>;

export default PageContainer;
