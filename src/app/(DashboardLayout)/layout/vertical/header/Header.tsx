import { useDispatch, useSelector } from '@/store/hooks';
import { toggleMobileSidebar, toggleSidebar } from '@/store/menu';
import { AppState } from '@/store/store';
import { AnyType } from '@/types/shared';
import { shadows } from '@/utils/theme/Shadows';
import { Icon } from '@iconify/react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import Profile from './Profile';
import Notifications from './Notification';
import Language from './Language';

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: shadows[9],
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  borderRadius: 13,
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

const Header = () => {
  const lgUp = useMediaQuery((theme: AnyType) => theme.breakpoints.up('lg'));

  // drawer
  const customizer = useSelector((state: AppState) => state.customizer);
  const dispatch = useDispatch();

  return (
    <AppBarStyled
      position="sticky"
      color="default"
      sx={{
        background: '#ffffff',
        minHeight: customizer.TopbarHeight,
      }}
    >
      <ToolbarStyled sx={{ minHeight: customizer.TopbarHeight }}>
        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ flexGrow: 1 }}
        >
          {/* ------------------------------------------- */}
          {/* Toggle Button Sidebar */}
          {/* ------------------------------------------- */}
          <Button
            color="inherit"
            aria-label="menu"
            size="large"
            className="btn-rounded-circle-40"
            onClick={
              lgUp
                ? () => dispatch(toggleSidebar())
                : () => dispatch(toggleMobileSidebar())
            }
            sx={{
              display: 'flex',
            }}
          >
            <Icon
              color="inherit"
              icon="solar:list-bold-duotone"
              width="24"
              height="24"
            />
          </Button>

          {/* ------------------------------------------- */}
          {/* Search Dropdown */}
          {/* ------------------------------------------- */}
          {/*<Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{
              p: '30px 25px 20px',
              marginBottom: '5px',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h4" mb={1}>
              {cardTitle}
            </Typography>
          </Stack>*/}
        </Stack>
        {/*<Box flexGrow={1} />*/}

        <Stack spacing={2} direction="row" alignItems="center">
          {/*{smUp ? <Search /> : ''}*/}
          <Language />
          {/* ------------------------------------------- */}
          {/* Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          {/* <Cart /> */}
          {/* ------------------------------------------- */}
          {/* End Ecommerce Dropdown */}
          {/* ------------------------------------------- */}
          <Notifications />
          {<Profile />}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
