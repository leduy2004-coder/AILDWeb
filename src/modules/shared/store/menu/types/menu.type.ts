import { IMenuPermission, IMenuSidebar } from '@/types/navigations';

export type MenuState = {
  menuItems: IMenuSidebar[];
  menusPermission: IMenuPermission[];
  menuItemSelected: IMenuPermission | null | undefined;
  isFetching: boolean;
  isCollapse: boolean;
  isSidebarHover: boolean;
  isMobileSidebar: boolean;
};
