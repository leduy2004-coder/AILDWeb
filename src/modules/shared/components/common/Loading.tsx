'use client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

interface LoadingProps {
  zIndex?: number;
}

export function Loading({ zIndex = 999 }: LoadingProps = {}) {
  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
        top: 0,
        left: 0,
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: '100px',
          height: '100px',
          display: 'flex',
          background: '#bcbfc24a',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '10px',
        }}
      >
        <CircularProgress />
      </Stack>
    </Box>
  );
}
