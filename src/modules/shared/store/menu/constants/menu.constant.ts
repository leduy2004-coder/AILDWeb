import { MenuState } from '../types';

export const initialState: MenuState = {
  menuItems: [],
  menusPermission: [],
  menuItemSelected: null,
  isFetching: true,
  isCollapse: false, // to make sidebar Mini by default
  isSidebarHover: false,
  isMobileSidebar: false,
};

export const ROOT_URL = '/';
export const CHANGE_PASSWORD_URL = '/change-password';
