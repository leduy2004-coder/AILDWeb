import { AnyType, IListRequest } from '@/types/shared';
import { DEFAULT_MAX_PAGE, DEFAULT_PAGE } from './dataTable.constant';

export const NO_CACHE_OPTION = {
  cacheTime: 0,
  staleTime: 0,
};

export const MASTER_DATA_CACHE_OPTION = {
  staleTime: 1000 * 60 * 60 * 24,
  cacheTime: 1000 * 60 * 60 * 24 * 7,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

// 5 minute cache for frequently changing data (course, group, viewer, template, etc.)
export const SHORT_CACHE_OPTION = {
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 30, // 30 minutes
  refetchOnMount: false,
  refetchOnWindowFocus: false,
};

export const EN_LOCALE = 'en';
export const VI_LOCALE = 'vi';
export const DEFAULT_NUMBER = 0;
export const DEFAULT_NUMBER_ONE = 1;
export const EMPTY_STRING = '';
export const DATE_TO_EMPTY_CHANGE = '2020-01-01 23:59:59';
export const ALL_STRING = 'all';
export const DEFAULT_NUMBER_TARIFFCODE = 55;
export const EMPTY_FIELD = '[EMPTY_FIELD]';
export const EMPTY_FIELD_TEXT = '';
export const EMPTY_ARRAY = [];
export const GET_ALL_RECORDS: IListRequest<AnyType> = {
  startRow: DEFAULT_PAGE.toString(),
  endRow: DEFAULT_MAX_PAGE.toString(),
  filterModel: {},
  sortModel: [],
};
export const GET_ALL_RECORDS_DESC: IListRequest<AnyType> = {
  startRow: DEFAULT_PAGE.toString(),
  endRow: DEFAULT_MAX_PAGE.toString(),
  filterModel: {},
  sortModel: [{ colId: 'id', sort: 'desc' }],
};

export const ROLE_ADMIN = 0;
export const ROLE_HOTEL = 2;

export const USER_TYPE = {
  STAFF: 1,
  ADMIN: 2,
};

export const ROLE_CODE = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
};
export const IMAGE_CODE = {
  PROJECT: 'PROJECT',
  NOTICE: 'NOTICE',
};
export const MENU_ADMIN = [ROLE_CODE.ADMIN];
export const MENU_STUDENT = [ROLE_CODE.ADMIN, ROLE_CODE.STUDENT];
export const MENU_TEACHER = [ROLE_CODE.ADMIN, ROLE_CODE.TEACHER];
export const MENU_ALL = [
  ROLE_CODE.ADMIN,
  ROLE_CODE.STUDENT,
  ROLE_CODE.TEACHER,
];

export const DEFAULT_PASSWORD_TO_EDIT = 'Password123';
export const CALL_API_EXCEPTION = 'EXCEPTION';
export const CALL_API_OK = 'OK';
export const STATUS_ACTIVITY = {
  ACTIVATED: 1,
  INACTIVATED: 0,
};
export const CALL_API_ERROR = 'ERROR';
export const INTERNAL_SERVER_ERROR = 'InternalServerError';
export const HOME_PAGE = '/';

export const LANGUAGE_LABEL = {
  EN: 'EN',
  CN: 'CN',
  KR: 'KR',
  JA: 'JP',
  VI: 'VN',
};
export const LANGUAGE_KEY = {
  EN: 'en',
  CN: 'zh',
  KR: 'ko',
  JA: 'ja',
  VI: 'vi',
};

export const MODULE_NAME_API = {
  STAFF: 'staff',
  GROUP: 'group',
  CONTENT: 'content',
  TEST: 'test',
  ADMIN: 'admin',
  COURSE: 'course',
  PROJECT: '/project',
  PROJECT_STORE: '/project/store-link',
  COMMUNICATE: '/communicate',
  SURVEY: '/survey',
  NOTICE: '/notice',
  NOTICE_READ: '/notice-read',
  STAFF_STORE_WORKING: 'staff-store-working',
  STAFF_STORE_WORKING_HISTORY: 'staff-store-working-history',
  REPORT_TASK: 'staff-store-working-report',
  REPORT_EXPENSE: 'staff-store-working-expense',
  REPORT_ADVANCE: 'staff-store-working-advance',
};

export const LOCAL_STORAGE_LANG_KEY_REGISTER = 'selectedLanguage';

export const JAPAN_SUPPORT_LINK = 'https://luggo.apex24.net/#faq';
export const SUPPORT_LINK = 'https://luggo.apex24.net/en/#Pfaq';

export const LOCALE_JAPAN = 'ja-JP';
export const FONT_SIZE_BASE = '16px';
export const REFRESH = 'refresh';
export const MONTH = 'month';
export const YEAR = 'year';
export const MAX_DATE_YEARS_AHEAD = 5;
export const NEXT = 'next';
export const PREVIOUS = 'previous';
export const PAYMENTSTATUS = 'paymentStatus';
export const DAY = 'day';

export const MAX_FILE_SIZE_PDF = 20 * 1024 * 1024;
export const MAX_FILE_SIZE_IMG = 5 * 1024 * 1024;
export const MAX_FILE_SIZE_VIDEO = 50 * 1024 * 1024;
