import { ROLE_CODE } from '@/modules/shared/constants';
import { getUserInfoByAccessToken } from './yupForm.utils';

export interface UserRole {
  authority: string;
}

/**
 * Get the current user's roles from access token
 */
export const getCurrentUserRoles = (): string[] => {
  try {
    const userInfoString = getUserInfoByAccessToken() || '';
    const userLogin = JSON.parse(userInfoString) || {};
    return userLogin.roles?.map((r: UserRole) => r.authority) || [];
  } catch {
    return [];
  }
};

/**
 * Check if the current user has ADMIN role
 */
export const isAdmin = (): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(ROLE_CODE.ADMIN);
};

/**
 * Check if the current user has STUDENT role
 */
export const isStudent = (): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(ROLE_CODE.STUDENT);
};

/**
 * Check if the current user has TEACHER role
 */
export const isTeacher = (): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(ROLE_CODE.TEACHER);
};

/**
 * Check if the current user has a specific role
 */
export const hasRole = (role: string): boolean => {
  const roles = getCurrentUserRoles();
  return roles.includes(role);
};
