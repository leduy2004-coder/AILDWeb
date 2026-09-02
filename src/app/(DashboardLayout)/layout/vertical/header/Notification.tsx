import Scrollbar from '@/app/(DashboardLayout)/components/custom-scroll/Scrollbar';
import { AnyType } from '@/types/shared';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import * as dropdownData from './data';

import { Icon } from '@iconify/react';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const { t } = useTranslation();
  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClick2 = (event: AnyType) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick2}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 45,
            height: 45,
            position: 'relative',
            animationName: 'pulse',
          }}
        >
          <Icon
            color="inherit"
            icon="solar:bell-bing-line-duotone"
            width="24"
            height="24"
          />
          <Box
            sx={{
              position: 'absolute',
              top: '2px',
              right: '1px',
              height: '18px',
              width: '18px',
              zIndex: '10',
              border: '2px solid #4bd08b',
              borderRadius: '70px',
              animationIterationCount: 'infinite !important',
              animation: 'heartbit 1s ease-out',
            }}
          ></Box>
          <Box
            sx={{
              width: '4px',
              height: '4px',
              borderRadius: '30px',
              position: 'absolute',
              right: '8px',
              top: '9px',
              backgroundColor: 'success.main',
              zIndex: '11',
            }}
          ></Box>
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
          },
        }}
      >
        <Stack
          direction="row"
          py={2}
          px={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">
            {t('header.notification.notifications')}
          </Typography>
          <Chip label="5 new" color="primary" size="small" />
        </Stack>
        <Scrollbar sx={{ height: '385px' }}>
          {dropdownData.notifications.map((notification, index) => (
            <Box key={index}>
              <MenuItem sx={{ py: 2, px: 4 }}>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    src={notification.avatar}
                    alt={notification.avatar}
                    sx={{
                      width: 48,
                      height: 48,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      color="textPrimary"
                      fontWeight={600}
                      noWrap
                      sx={{
                        width: '240px',
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="subtitle2"
                      sx={{
                        width: '240px',
                      }}
                      noWrap
                    >
                      {notification.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </MenuItem>
            </Box>
          ))}
        </Scrollbar>
        <Box p={3} pb={1}>
          <Button
            href="/"
            variant="outlined"
            component={Link}
            color="primary"
            fullWidth
          >
            {t('header.notification.see_all_notification')}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Notifications;
