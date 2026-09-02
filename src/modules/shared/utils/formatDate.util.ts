import {
  EMPTY_STRING,
} from '@/modules/shared/constants';
import { format } from 'date-fns';
import { getSelectedLanguage } from './yupForm.utils';

export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return EMPTY_STRING;
  try {
    return format(new Date(date), 'yyyy/MM/dd');
  } catch {
    return EMPTY_STRING;
  }
};
export const formatDateTime = (date: Date | string | undefined): string => {
  if (!date) return EMPTY_STRING;
  try {
    return format(new Date(date), 'yyyy/MM/dd HH:mm');
  } catch {
    return EMPTY_STRING;
  }
};
export const formatDateTimeExportExcel = (
  date: Date | string | undefined,
): string => {
  if (!date) return EMPTY_STRING;
  try {
    return format(new Date(date), 'yyyyMMddHHmmss');
  } catch {
    return EMPTY_STRING;
  }
};
export const formatTime = (date: Date | string | undefined): string => {
  if (!date) return EMPTY_STRING;
  try {
    return format(new Date(date), 'HH:mm');
  } catch {
    return EMPTY_STRING;
  }
};
