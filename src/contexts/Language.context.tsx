// src/contexts/LanguageContext.tsx
import { getSelectedLanguage } from '@/modules/shared/utils';
import { createContext, useContext, useState, useMemo } from 'react';

const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
}>({
  language: 'vi',
  setLanguage: () => { },
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState(() => getSelectedLanguage());

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
