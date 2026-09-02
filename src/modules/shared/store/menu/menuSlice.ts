import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './constants';
import {
  setMenusReducer,
  setMenuItemReducer,
  setMenuByUrlReducer,
} from './reducers/menu.reducer';

export const MenuSlide = createSlice({
  name: 'menuSlide',
  initialState,
  reducers: {
    setMenus: setMenusReducer,
    setMenuItem: setMenuItemReducer,
    setMenuByUrl: setMenuByUrlReducer,
    toggleSidebar: (state) => {
      state.isCollapse = !state.isCollapse;
    },
    hoverSidebar: (state, action) => {
      state.isSidebarHover = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebar = !state.isMobileSidebar;
    },
  },
});

export const {
  setMenus,
  setMenuItem,
  setMenuByUrl,
  toggleSidebar,
  hoverSidebar,
  toggleMobileSidebar,
} = MenuSlide.actions;

export default MenuSlide.reducer;
