'use client';

import { ToastContainer } from 'react-toastify';

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer style={{ zIndex: 9999999 }} position="top-right" />
    </>
  );
}
