'use client';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingBackdropProps {
  open: boolean;
  zIndex?: number;
}

/**
 * Full-screen loading overlay with backdrop
 * Use this to show loading state during async operations
 */
export function LoadingBackdrop({ open, zIndex = 9999 }: LoadingBackdropProps) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: zIndex }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
