export const PATH_NAME = {
  LOGIN: '/auth/login',
  HOME: '/home',
  ADMIN: '/admin/overview',
  TEACHER: '/teacher/overview',
  STUDENT: '/student/overview',
};

export const RESPONSE_CODE = {
  REQUEST_SUCCESS: 1,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};
export const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm:ss';

export enum EToken {
  'INVALID_REFRESH_TOKEN' = 'Invalid refresh token',
  'ACCESS_TOKEN_EXPIRED' = 'Access token expired',
}
