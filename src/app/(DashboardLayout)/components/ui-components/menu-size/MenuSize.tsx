import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

const MenuSize = () => {
  const theme = useTheme();
  const customizerState = useSelector((state: AppState) => state.customizer);
  const menuState = useSelector((state: AppState) => state.menu);

  return (
    <Stack
      sx={{
        ...(menuState.isCollapse && {
          [theme.breakpoints.up('lg')]: {
            width: `${customizerState.MiniSidebarWidth}px`,
          },
        }),
        ...(!menuState.isCollapse && {
          [theme.breakpoints.up('lg')]: {
            width: `${customizerState.SidebarWidth}px`,
          },
        }),
      }}
    />
  );
};

export default MenuSize;
