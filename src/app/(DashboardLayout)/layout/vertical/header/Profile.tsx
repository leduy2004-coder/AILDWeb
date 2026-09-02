import { Icon } from '@iconify/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ConfirmModal } from '@/modules/shared/components';

import { AnyType, AuthActionTypes, IDetailUserResponse } from '@/types/shared';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ActionButton } from '@/modules/shared/styled';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { logout } from '@/apis/auth/auth.api';
import { disableUnsavedWarning, useAppModal, useLoadingIndicator } from '@/modules/shared/hooks';
import { Tooltip } from '@mui/material';
import logoImg from '@/assests/images/logo.png';

const Profile = () => {
  const { t } = useTranslation();
  const { show: showConfirmModal } = useAppModal(ConfirmModal);
  const { showLoading, hideLoading } = useLoadingIndicator();
  const [anchorEl2, setAnchorEl2] = useState(null);
  const router = useRouter();
  const handleClick2 = (event: AnyType) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [userInfo, setUserInfo] = useState<IDetailUserResponse>();
  useEffect(() => {
    const userInfoStr = getLocalStorageItem<string>(AuthActionTypes.USER_INFO);
    if (userInfoStr) {
      try {
        setUserInfo(JSON.parse(userInfoStr));
      } catch (e) {
        console.error("Failed to parse userInfo", e);
      }
    }
  }, []);

  function handleLogout() {
    showConfirmModal({
      title: t('header.profile.popup_confirm.title'),
      description: t('header.profile.popup_confirm.confirm'),
      onAgree: logoutAndRedirect
    });

  }

  const logoutAndRedirect = async () => {
    showLoading();
    try {
      disableUnsavedWarning();
      await logout();
      
      // Clear session variables
      localStorage.removeItem(AuthActionTypes.ACCESS_TOKEN);
      localStorage.removeItem(AuthActionTypes.REFRESH_TOKEN);
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      hideLoading();
    }
  };

  const navigate = () => {
    setAnchorEl2(null);
    router.push('/change-password');
  };
  function handleChangePassword() {
    navigate();
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 45,
            height: 45,
            borderRadius: 25,
            backgroundColor: '#0084E5',
          }}
        >
          <Typography variant="h3" color="white">
            {userInfo?.email?.substring(0, 1).toUpperCase()}
          </Typography>
        </Box>
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            p: 3,
          },
        }}
      >
        <Typography variant="h5">{t('header.profile.title')}</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={logoImg.src}
            alt={'ProfileImg'}
            sx={{
              objectFit: 'contain',
              width: 70,
              height: 70,
              '& img': {
                objectFit: 'contain',
              },
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          />
          <Box>
            <Tooltip title={userInfo?.name || ''} arrow>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                sx={{
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {userInfo?.name || ''}
              </Typography>
            </Tooltip>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon icon="solar:letter-line-duotone" width="15" height="15" />
              </Box>
              <Tooltip title={userInfo?.email || ''} arrow>
                <Box
                  sx={{
                    maxWidth: '270px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: '600',
                  }}
                >
                  {userInfo?.email}
                </Box>
              </Tooltip>
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Grid container spacing={2}>
            <Grid size={6}>
              <ActionButton
                variant="contained"
                color="success"
                onClick={handleChangePassword}
                fullWidth
              >
                {t('header.profile.changePassword')}
              </ActionButton>
            </Grid>
            <Grid size={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                fullWidth
              >
                {t('header.profile.logout')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
