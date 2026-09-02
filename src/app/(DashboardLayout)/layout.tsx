'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { LanguageProvider, PermissionRulesProvider } from '@/contexts';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import LoadingIndicator from './components/loading-indicator/LoadingIndicator';
import MenuSize from './components/ui-components/menu-size/MenuSize';
import Header from './layout/vertical/header/Header';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import { ScrollTop } from './layout/shared/Scrolltotop/ScrollToTop';
import { usePathname, useRouter } from 'next/navigation';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { AuthActionTypes } from '@/types/shared';
import { setMenuByUrl } from '@/store/menu';

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  paddingBottom: '60px',
  flexDirection: 'column',
  zIndex: 1,
  backgroundColor: 'transparent',
}));

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const customizer = useSelector((state: AppState) => state.customizer);
  const { menuItems } = useSelector((state: AppState) => state.menu);

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const accessToken = getLocalStorageItem<string>(
      AuthActionTypes.ACCESS_TOKEN,
    );
    if (!accessToken) {
      router.push('/auth/login');
    } else {
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!menuItems.length) return;
    dispatch(setMenuByUrl(pathname));
  }, [dispatch, menuItems.length, pathname]);
  if (isAuthenticated === null) {
    return <div></div>;
  }
  return (
    <LanguageProvider>
      <PermissionRulesProvider>
        <MainWrapper sx={{ padding: customizer.isHorizontal ? 0 : '20px' }}>
          <LoadingIndicator />

          <title>{t('title')}</title>
          {/* ------------------------------------------- */}
          {/* Main Wrapper */}
          {/* ------------------------------------------- */}
          <Box width="100%">
            {/* PageContent */}

            {/* ------------------------------------------- */}
            {/* Sidebar */}
            {/* ------------------------------------------- */}
            {customizer.isHorizontal ? '' : <Sidebar />}

            <PageWrapper
              className="page-wrapper"
              sx={{
                display: 'flex',
                gap: '0 20px',
                [theme.breakpoints.up('lg')]: {
                  gridTemplateColumns: 'auto 1fr',
                  display: 'grid',
                },
              }}
            >
              <MenuSize />

              <Stack
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  alignItems: 'center',
                }}
              >
                <Container
                  sx={{
                    maxWidth:
                      customizer.isLayout === 'boxed' ? 'lg' : '100%!important',
                    padding: '0px !important',
                    margin: 0,
                  }}
                >
                  {/* ------------------------------------------- */}
                  {/* Header */}
                  {/* ------------------------------------------- */}
                  {customizer.isHorizontal ? ' ' : <Header />}

                  {/* ------------------------------------------- */}
                  {/* PageContent */}
                  {/* ------------------------------------------- */}

                  <Box
                    sx={{
                      minHeight: 'calc(100vh - 170px)',
                      py: { sm: 3 },
                      mt: { sm: 0, xs: 1 },
                    }}
                  >
                    {/* <Outlet /> */}
                    {children}
                    {/* <Index /> */}
                  </Box>

                  {/* ------------------------------------------- */}
                  {/* End Page */}
                  {/* ------------------------------------------- */}
                </Container>
              </Stack>
              {/* ------------------------------------------- */}
              {/* Hide Customizer*/}
              {/* ------------------------------------------- */}
              <ScrollTop />
              {/*<Customizer />*/}
            </PageWrapper>
          </Box>
        </MainWrapper>
      </PermissionRulesProvider>
    </LanguageProvider>
  );
}
