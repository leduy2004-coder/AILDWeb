/** Matches the backend AdminBadgeType enum */
export type AdminBadgeType = 'SUBMISSIONS' | 'RESOURCE_REPORTS' | 'USERS';

/** Which admin menus have something new (green dot), shared by every admin */
export interface IAdminBadges {
  submissions: boolean;
  resourceReports: boolean;
  users: boolean;
}
