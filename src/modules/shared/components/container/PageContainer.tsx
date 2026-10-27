"use client";
import { ReactNode } from 'react';

type Props = {
  description?: string;
  children: ReactNode;
  title?: string | number | null;
};

// Tab title/description are rendered by PageMeta (i18n-aware), not here
export const PageContainer = ({ children }: Props) => <div>{children}</div>;
