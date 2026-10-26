import { ROLE_CODE } from '@/modules/shared/constants';

// Admin and student portals can run on separate domains. Both URLs are baked in at build time;
// when either is missing (local dev) one domain serves every page and any role can log in.
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;
const STUDENT_URL = process.env.NEXT_PUBLIC_STUDENT_URL;

export const isPortalSplit = (): boolean => Boolean(ADMIN_URL && STUDENT_URL);

export const isAdminPortal = (): boolean => {
  if (!isPortalSplit() || typeof window === 'undefined') return false;
  return window.location.hostname === new URL(ADMIN_URL!).hostname;
};

/**
 * i18n key of the error to show when a user with this role must not log in on the current portal,
 * or null when the login is allowed.
 */
export const getPortalRoleError = (role?: string): string | null => {
  if (!isPortalSplit()) return null;
  if (isAdminPortal()) {
    return role === ROLE_CODE.ADMIN ? null : 'login.wrongPortal.adminOnly';
  }
  return role === ROLE_CODE.ADMIN ? 'login.wrongPortal.useAdminPortal' : null;
};
