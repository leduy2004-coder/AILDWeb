import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SidebarItems from './SidebarItems';
import Logo from '../../shared/logo/Logo';
import { useSelector, useDispatch } from '@/store/hooks';
import Scrollbar from '@/app/(DashboardLayout)/components/custom-scroll/Scrollbar';
import { AppState } from '@/store/store';
import { AnyType } from '@/types/shared';

import { hoverSidebar, toggleMobileSidebar } from '@/store/menu';

export default function Sidebar() {
  const lgUp = useMediaQuery((theme: AnyType) => theme.breakpoints.up('lg'));
  const customizerState = useSelector((state: AppState) => state.customizer);
  const menuState = useSelector((state: AppState) => state.menu);
  const dispatch = useDispatch();
  const theme = useTheme();
  const toggleWidth =
    menuState.isCollapse && !menuState.isSidebarHover
      ? customizerState.MiniSidebarWidth
      : customizerState.SidebarWidth;

  const onHoverEnter = () => {
    if (menuState.isCollapse) {
      dispatch(hoverSidebar(true));
    }
  };

  const onHoverLeave = () => {
    dispatch(hoverSidebar(false));
  };

  if (lgUp) {
    return (
      <Box
        sx={{
          zIndex: 100,
          width: toggleWidth,
          flexShrink: 0,
          ...(menuState.isCollapse && {
            position: 'absolute',
          }),
          borderRadius: '13px',
        }}
        bgcolor="#ffffff"
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          variant="permanent"
          PaperProps={{
            sx: {
              boxShadow: customizerState.isCardShadow ? 9 : 0,
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shortest,
              }),
              width: toggleWidth,
              borderRight: 0,
              boxSizing: 'border-box',
              top: 20,
              left: 20,
              bottom: 20,
              borderRadius: '13px',
              height: 'calc(100% - 40px)',
              color: theme.palette.text.primary,
              background: '#ffffff',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: '100%',
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <Box px={2} pt={2} pb={1}>
              <Logo isSidebar />
            </Box>
            <Scrollbar
              sx={{
                height: menuState.isCollapse
                  ? 'calc(100% - 90px)'
                  : 'calc(100% - 120px)',
              }}
            >
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
            </Scrollbar>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={menuState.isMobileSidebar}
      onClose={() => dispatch(toggleMobileSidebar())}
      variant="temporary"
      PaperProps={{
        sx: {
          width: customizerState.SidebarWidth,
          color: theme.palette.text.primary,
          border: '0 !important',
          boxShadow: (theme) => theme.shadows[8],
          background: '#ffffff',
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <Box px={2}>
        <Logo isSidebar />
      </Box>
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
    </Drawer>
  );
}
