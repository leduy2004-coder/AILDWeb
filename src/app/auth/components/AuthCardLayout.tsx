'use client';
import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';

/** Centered card used by the single-form auth pages (verify OTP, forgot / reset password) */
export default function AuthCardLayout({ children }: { children: ReactNode }) {
  const customizer = useSelector((state: AppState) => state.customizer);

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 'calc(100vh - 180px)',
        py: 4,
        backgroundColor: (theme) => theme.palette.grey[200],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 480, px: 2 }}>
        <Box
          sx={{
            borderRadius: customizer.borderRadius / 18,
            boxShadow: '0 2px 30px 15px rgba(37,83,185,.1)',
            backgroundColor: 'white',
            p: { xs: 3, sm: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
