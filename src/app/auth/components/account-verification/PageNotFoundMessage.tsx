import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import customBreakpointTheme from '@/utils/customBreakPointTheme';
import Image from 'next/image';
import { lora } from '@/fonts/lora-font';
// import errorIcon from 'public/images/account-verfication/error-icon.png';

function PageNotFoundMessage() {
  const { t } = useTranslation();
  const theme = customBreakpointTheme;
  return (
    <Box
      height="214px"
      bgcolor="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        borderTop: '5px solid #005D97',
        padding: '20px',
        textAlign: 'center',
        width: '350px',
        [theme.breakpoints.up('md')]: {
          width: '700px',
        },
      }}
    >
      <Image
        src={'/images/account-verification/error-icon.png'}
        alt=""
        width={100}
        height={50}
      />
      <Typography
        fontSize="20px"
        fontWeight="500"
        color="#474747"
        fontFamily={`${lora.style.fontFamily} !important`}
        sx={{
          whiteSpace: 'pre-line',
          lineHeight: '2rem',
          marginTop: '10px',
          paddingX: '5px',
          [theme.breakpoints.up('md')]: {
            paddingX: '60px',
          },
        }}
      >
        {t('en.user.message.page_not_found')}
      </Typography>
    </Box>
  );
}

export default PageNotFoundMessage;
