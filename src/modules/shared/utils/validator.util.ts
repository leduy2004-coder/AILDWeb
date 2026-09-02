import { EMPTY_FIELD } from '@/modules/shared/constants';
import upperFirst from 'lodash/upperFirst';
import { t } from 'i18next';

export function getRequireFieldMsg(fieldName = EMPTY_FIELD) {
  return `${upperFirst(fieldName)} ${t('validation.require')}`;
}

export function getMinMsg(fieldName = EMPTY_FIELD, num = 1) {
  return `${upperFirst(fieldName)} ${t('validation.minLength', { num })}`;
}

export function getMaxMsg(fieldName = EMPTY_FIELD, num = 1) {
  return `${upperFirst(fieldName)} ${t('validation.maxLength', { num })}`;
}

export function getMaxMsgOfNumber(fieldName = EMPTY_FIELD, num = 1) {
  return `${upperFirst(fieldName)} ${t('validation.maxLengthNumber', { num })}`;
}

export function getLengthMsg(fieldName = EMPTY_FIELD, num = 1) {
  return `${upperFirst(fieldName)} ${t('validation.exactLength', { num })}`;
}

export function getLengthNumberMsg(fieldName = EMPTY_FIELD, num = 1) {
  return `${upperFirst(fieldName)} ${t('validation.exactDigits', { num })}`;
}

export function getBetweenMsg(fieldName = EMPTY_FIELD, min = 1, max = 1) {
  return `${upperFirst(fieldName)} ${t('validation.betweenLength', { min, max })}`;
}

export function getLessThanMsg(fieldName = EMPTY_FIELD, min = 0) {
  return `${upperFirst(fieldName)} ${t('validation.greaterThan', { min })}`;
}

export function getMatchesMsg(fieldName = EMPTY_FIELD) {
  return `${upperFirst(fieldName)} ${t('validation.invalidFormat')}`;
}

export function getRequireIntegerdMsg(fieldName = EMPTY_FIELD) {
  return `${upperFirst(fieldName)} ${t('validation.requireInteger')}`;
}

export function isNumber(value: string) {
  return !isNaN(+value) && !isNaN(parseFloat(value));
}

export function getRequireFieldMsgForm(fieldName = EMPTY_FIELD) {
  return `${upperFirst(fieldName)}`;
}

export function toSafeNumber(
  value: string | number | unknown,
  defaultValue: number = 0,
): number {
  const num = Number(value);
  return Number.isNaN(num) ? defaultValue : num;
}
