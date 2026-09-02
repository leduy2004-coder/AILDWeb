'use client';

import { Inter, Poppins } from 'next/font/google';
import React, { useEffect, useState } from 'react';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

import { getSelectedLanguage } from '@/modules/shared/utils';
import { LANGUAGE_KEY } from '@/modules/shared/constants';

export default function FontWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<string>();

  useEffect(() => {
    setLang(getSelectedLanguage());
  }, []);
  const fontClass =
    lang === LANGUAGE_KEY.CN ? inter.className : poppins.className;

  return <body className={`notranslate ${fontClass} `}>{children}</body>;
}
