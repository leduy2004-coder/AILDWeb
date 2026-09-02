import { IMenu, IMenuSidebar } from '@/types/navigations';
import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import {
  mapMenuPermissionToMenuSidebar,
  mapMenuToMenuPermission,
} from '../mappers';
import { MenuState } from '../types';
import { findMenu } from '../utils';
import { ROOT_URL, CHANGE_PASSWORD_URL } from '../constants';

const setMenusReducer: CaseReducer<MenuState, PayloadAction<IMenu[]>> = (
  state,
  action,
) => {
  state.menusPermission = action.payload.map(mapMenuToMenuPermission);
  state.menuItems = state.menusPermission.map(mapMenuPermissionToMenuSidebar);
  state.isFetching = false;
};

const setMenuItemReducer: CaseReducer<
  MenuState,
  PayloadAction<IMenuSidebar | null>
> = (state, action) => {
  state.menuItemSelected = state.menusPermission
    .map((menuPermission) =>
      findMenu({
        menu: menuPermission,
        by: 'code',
        value: action.payload?.code,
      }),
    )
    .filter(Boolean)[0];
};

const setMenuByUrlReducer: CaseReducer<MenuState, PayloadAction<string>> = (
  state,
  action,
) => {
  const menu = state.menusPermission
    .map((menuPermission) => {
      return findMenu({
        menu: menuPermission,
        by: 'link',
        value: action.payload,
      });
    })
    .filter(Boolean)[0];

  const isWhitelisted = [ROOT_URL, CHANGE_PASSWORD_URL].includes(window.location.pathname) || 
    window.location.pathname.startsWith('/admin/classes');

  if (!menu && !isWhitelisted) {
    window.location.replace(ROOT_URL);
    return;
  }

  state.menuItemSelected = menu;
};

export { setMenuItemReducer, setMenusReducer, setMenuByUrlReducer };
