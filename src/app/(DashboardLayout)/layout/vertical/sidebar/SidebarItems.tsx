import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { useEffect, useMemo } from 'react';

import { SkeletonLoading } from '@/modules/shared/components';
import { AnyType } from '@/types/shared';

import { useDispatch, useSelector } from '@/store/hooks';
import { setMenuByUrl, setMenuItem, toggleMobileSidebar } from '@/store/menu';
import { AppState } from '@/store/store';
import useMediaQuery from '@mui/material/useMediaQuery';
import { usePathname } from 'next/navigation';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import NavItem from './NavItem';
import { IMenuSidebar } from '@/types/navigations';

const SidebarItems = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const menuState = useSelector((state: AppState) => state.menu);
  const lgUp = useMediaQuery((theme: AnyType) => theme.breakpoints.up('lg'));
  const hideMenu: AnyType = lgUp
    ? menuState.isCollapse && !menuState.isSidebarHover
    : '';

  const {
    menuItems,
    menuItemSelected,
    isFetching: isFetchingMenu,
  } = useSelector((state: AppState) => state.menu);

  function handleMenuSelected(item: IMenuSidebar) {
    dispatch(setMenuItem(item));

    if (!lgUp) {
      dispatch(toggleMobileSidebar());
    }
  }

  useEffect(
    function setMenuSelectedByUrl() {
      if (menuItemSelected || !menuItems?.length) return;

      dispatch(setMenuByUrl(pathDirect));
    },
    [menuItemSelected, pathDirect, menuItems],
  );

  return (
    <Box sx={{ pl: '20px' }}>
      <SkeletonLoading
        isLoading={isFetchingMenu}
        count={12}
        width="90%"
        className="mb-4"
      >
        <List sx={{ pt: 0 }} className="sidebarNav">
          {menuItems.map((item) => {
            // {/********SubHeader**********/}
            if (item.isHidden) {
              return <></>;
            }

            if (item.subheader) {
              return (
                <NavGroup
                  item={item}
                  hideMenu={hideMenu}
                  key={item.subheader}
                />
              );
            }

            // {/********If Sub Menu**********/}
            if (item.children?.length) {
              return (
                <NavCollapse
                  menu={item}
                  pathDirect={pathDirect}
                  hideMenu={hideMenu}
                  pathWithoutLastPart={pathWithoutLastPart}
                  level={1}
                  key={item.id}
                  onClick={handleMenuSelected}
                />
              );
            }

            // {/********If Sub No Menu**********/}
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={handleMenuSelected}
              />
            );
          })}
        </List>
      </SkeletonLoading>
    </Box>
  );
};
export default SidebarItems;
