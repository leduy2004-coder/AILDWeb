import { EMPTY_FIELD_TEXT } from './common.constant';
import { useTranslation } from 'react-i18next';

export enum ActiveStatus {
  EMPTY = '',
  TRUE = 'true',
  FALSE = 'false',
}

export const useActiveStatusText = () => {
  const { t } = useTranslation();

  return {
    [ActiveStatus.TRUE]: t('active'),
    [ActiveStatus.FALSE]: t('inactive'),
    [ActiveStatus.EMPTY]: EMPTY_FIELD_TEXT,
  };
};

export enum NumberStatus {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const ListStringFilterOperators = ['equals', 'contains', 'startsWith'];

export enum Status {
  ACTIVE = '1',
  INACTIVE = '0',
  ALL = '-1',
}

export const ExecTypeOptions = [
  {
    value: 'TC',
    label: 'TC',
  },
  {
    value: 'TT',
    label: 'TT',
  },
];

export const enum MasterDataType {
  AREA = 'area',
  PREFECTURES = 'prefectures',
  SEX = 'sex',
  COUNTRY = 'country',
  STATUS_INQUIRY = 'statusInquiry',
  CATEGORY_INQUIRY = 'inquiryCategory',
  STATUS_LUGGAGE = 'statusLuggage',
  SCHEDULED_BOARDING_TIME = 'scheduledBoardingTime',
}
export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
  HOLIDAY = 'HOLIDAY',
}
export const DayOfWeekOptions = [
  {
    value: DayOfWeek.MONDAY,
    label: 'stores.label.dayOfWeek.monday',
  },
  {
    value: DayOfWeek.TUESDAY,
    label: 'stores.label.dayOfWeek.tuesday',
  },
  {
    value: DayOfWeek.WEDNESDAY,
    label: 'stores.label.dayOfWeek.wednesday',
  },
  {
    value: DayOfWeek.THURSDAY,
    label: 'stores.label.dayOfWeek.thursday',
  },
  {
    value: DayOfWeek.FRIDAY,
    label: 'stores.label.dayOfWeek.friday',
  },
  {
    value: DayOfWeek.SATURDAY,
    label: 'stores.label.dayOfWeek.saturday',
  },
  {
    value: DayOfWeek.SUNDAY,
    label: 'stores.label.dayOfWeek.sunday',
  },
  {
    value: DayOfWeek.HOLIDAY,
    label: 'stores.label.dayOfWeek.holiday',
  },
];

export enum SexType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum RoleType {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

export enum fieldTypeKey {
  TEXTBOX = 'TEXTBOX',
  CHECKBOX = 'CHECKBOX',
  RADIO_BUTTON = 'RADIO_BUTTON',
}

export enum StatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  OK = 200,
}
