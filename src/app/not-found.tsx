'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import notFoundImg from '@/assests/images/notfound.jpg';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
    >
      <Container maxWidth="md">
        <Image
          src={notFoundImg}
          alt="404"
          width={800}
          height={300}
          style={{ width: '100%', maxWidth: '800px', height: 'auto', objectFit: 'contain' }}
        />
        <Typography align="center" variant="h1" mb={2} mt={4}>
          Oops!!!
        </Typography>
        <Typography align="center" variant="h4" mb={4}>
          {t('not_found.message')}
        </Typography>
        <Button
          color="primary"
          variant="contained"
          component={Link}
          href="/"
          disableElevation
        >
          {t('not_found.button')}
        </Button>
      </Container>
    </Box>
  );
}
