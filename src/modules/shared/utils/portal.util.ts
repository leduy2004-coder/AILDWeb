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

/** Admins may log in only on the admin portal, other roles only on the student portal. */
export const isRoleAllowedOnPortal = (role?: string): boolean => {
  if (!isPortalSplit()) return true;
  return isAdminPortal() === (role === ROLE_CODE.ADMIN);
};
