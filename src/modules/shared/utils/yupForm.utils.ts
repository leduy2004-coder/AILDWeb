import {
  AuthActionTypes,
} from '@/types/shared';
import { get } from 'lodash';
import {
  FieldValues,
  Path,
  PathValue,
  SetValueConfig,
  UseFormReturn,
} from 'react-hook-form';
import {
  LANGUAGE_KEY,
} from '@/modules/shared/constants';
import { getLocalStorageItem } from '@/modules/shared/utils/localStorage.util';
import jwt_decode from 'jwt-decode';

export const isError =
  <T>(form: UseFormReturn<T & FieldValues>) =>
    (field: keyof T): boolean | undefined => {
      return !!get(form.formState.errors, field);
    };

export const getErrorMessage =
  <T>(form: UseFormReturn<T & FieldValues>) =>
    (field: keyof T): string | undefined => {
      return get(form.formState.errors, field)?.message as string;
    };

export const setValues =
  <T>(form: UseFormReturn<T & FieldValues>) =>
    (values: Partial<T & FieldValues>, setValueOptions?: SetValueConfig) => {
      Object.entries(values).forEach(([key, value]) => {
        const typedKey = key as Path<T & FieldValues>;
        const typedValue = value as PathValue<
          T & FieldValues,
          Path<T & FieldValues>
        >;
        if (typedValue !== form.getValues([typedKey]))
          form.setValue(typedKey, typedValue, setValueOptions);
      });
    };

export function getSelectedLanguage() {
  const selectedLanguage = getLocalStorageItem<string>('selectedLanguage');
  if (selectedLanguage === LANGUAGE_KEY.EN || selectedLanguage === LANGUAGE_KEY.VI) {
    return selectedLanguage;
  }
  return getDefaultLanguage();
}

export const getUserInfoByAccessToken = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      const token = getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN);
      if (!token) return null;

      const decoded = jwt_decode<string>(token);
      return JSON.stringify(decoded);
    }
  } catch (error) {
    console.error('Cannot decode token:', error);
  }
  return null;
};

interface JwtPayload {
  user_name: string;
}
export const getUsernameByAccessToken = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      const token = getLocalStorageItem<string>(AuthActionTypes.ACCESS_TOKEN);
      if (!token) return null;

      const decoded = jwt_decode<JwtPayload>(token);
      return decoded ? decoded.user_name : '';
    }
  } catch (error) {
    console.error('Cannot decode token:', error);
  }
  return null;
};

type LanguageValue = (typeof LANGUAGE_KEY)[keyof typeof LANGUAGE_KEY];

export function getDefaultLanguage(): LanguageValue {
  // const supportedLangs = Object.values(LANGUAGE_KEY);

  // if (typeof navigator !== 'undefined') {
  //   const browserLang = navigator.language?.split('-')[0];
  //   if (browserLang && supportedLangs.includes(browserLang as LanguageValue)) {
  //     return browserLang as LanguageValue;
  //   }
  // }
  return LANGUAGE_KEY.VI;
}

export function getUrlUpload() {
  return process.env.NEXT_PUBLIC_BASE_UPLOAD_FILE_URL;
}

export function getUrlDownload() {
  return process.env.NEXT_PUBLIC_BASE_DOWNLOAD_FILE_URL;
}
