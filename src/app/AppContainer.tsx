'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Box, CircularProgress, CssBaseline } from '@mui/material';
import NiceModal from '@ebay/nice-modal-react';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'dayjs/locale/vi';

import { ThemeSettings } from '@/utils/theme/Theme';
import { NextAppDirEmotionCacheProvider } from '@/utils/theme/EmotionCache';
import ToastProvider from '@/contexts/Toast.context';
import { AuthActionTypes } from '@/types/shared';
import '@/utils/i18n';
import { ConfirmModal } from '@/modules/shared/components';
import { ResourceListViewerModal } from '@/modules/public/home/components/modal/ResourceListViewerModal';

export default function AppContainer({ children }: { children: ReactNode }) {

  const theme = ThemeSettings();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 0,
          },
        },
      }),
  );

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // OPTIMIZATION: Register common modals to make them available faster
    // This helps reduce first-time mount delay
    NiceModal.register('confirm-modal', ConfirmModal);
    NiceModal.register('home-resource-list-modal', ResourceListViewerModal);
    setTimeout(() => setLoading(true), 3000);

    // Multi-tab synchronization
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AuthActionTypes.ACCESS_TOKEN) {
        if (!event.newValue) {
          // Token removed -> Logout
          window.location.replace('/auth/login');
        } else if (!event.oldValue && event.newValue) {
          // Token added -> Login
          window.location.replace('/');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'modernize' }}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <QueryClientProvider client={queryClient}>
            <NiceModal.Provider>
              <ToastProvider>
                <CssBaseline />
                {!loading ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: '100vh',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  children
                )}
              </ToastProvider>
            </NiceModal.Provider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
