import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from './languages/en.json';
import vietnam from '../utils/languages/vi.json';

const resources = {
  en: {
    translation: english,
  },
  vi: {
    translation: vietnam,
  }
};

const storedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem('selectedLanguage')
    : undefined;

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: storedLanguage || 'vi',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
// Force HMR 1
