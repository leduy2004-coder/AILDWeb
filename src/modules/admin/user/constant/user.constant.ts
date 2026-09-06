export const USER_ROLE_COLOR: Record<string, 'primary' | 'info' | 'success' | 'warning' | 'error' | 'default'> = {
  ADMIN: 'primary',
  STUDENT: 'info',
};

export const USER_STATUS_COLOR: Record<string, 'success' | 'error' | 'default'> = {
  true: 'success',
  false: 'error',
};

export const USER_ROLE_OPTIONS = [
  { value: 'ADMIN', labelKey: 'roles.ADMIN' },
  { value: 'STUDENT', labelKey: 'roles.STUDENT' },
];
