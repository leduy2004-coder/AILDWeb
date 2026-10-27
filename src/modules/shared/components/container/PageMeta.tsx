'use client';
import { useTranslation } from 'react-i18next';

type Props = {
  titleKey: string;
  descriptionKey?: string;
};

// React 19 hoists <title>/<meta> into <head>, and re-renders them when the language changes
export const PageMeta = ({ titleKey, descriptionKey }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <title>{t(titleKey)}</title>
      {descriptionKey && <meta name="description" content={t(descriptionKey)} />}
    </>
  );
};
