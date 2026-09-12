'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Typography, Avatar, useMediaQuery, Theme } from '@mui/material';

import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AuthLogin from '../components/authForms/AuthLogin';
import { signingSlice } from '@/modules/shared/store/auth';
import { Loading } from '@/modules/shared/components';
import { AuthActionTypes, ISigningBody } from '@/types/shared';

import { clearLocalStorageItems } from '@/modules/shared/utils/localStorage.util';
import { clearSessionStorage } from '@/modules/shared/utils/sessionStorage.util';


export default function Login() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const customizer = useSelector((state: AppState) => state.customizer);
  const [isLoading, setIsLoading] = useState(false);
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  useEffect(() => {
    clearLocalStorageItems([
      AuthActionTypes.ACCESS_TOKEN,
      AuthActionTypes.REFRESH_TOKEN,
      AuthActionTypes.USER_NAME,
      AuthActionTypes.USER_INFO,
    ]);
    clearSessionStorage();
  }, []);

  const handleLoginSubmit = async (body: ISigningBody) => {
    setIsLoading(true);
    try {
      await dispatch(signingSlice(body));
    } catch (error) {
      // Error is handled in the slice
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title={t('login.title')} description={t('login.title')}>
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 'calc(100vh - 180px)',
          py: 4,
          m: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
          borderRadius: customizer.borderRadius / 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >

        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 520, lg: 1000 },
            px: { xs: 2, sm: 2, md: 4 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Column - Logo and Image */}
            {lgUp && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      mt: 4,
                      position: 'relative',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(135, 206, 235, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          fontSize: '80px',
                          color: 'primary.main',
                          opacity: 0.3,
                        }}
                      >
                        ⭐✨
                      </Box>
                    </Box>
                  </Box>
                  {/* Testimonial */}
                  <Box sx={{ mt: 4, textAlign: 'left' }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'text.primary',
                        mb: 2,
                        lineHeight: 1.6,
                      }}
                    >
                      &ldquo;{t('login.testimonial.text')}&rdquo;
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 50,
                          height: 50,
                          bgcolor: 'primary.main',
                        }}
                      >
                        SJ
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: '600',
                            color: 'text.primary',
                          }}
                        >
                          {t('login.testimonial.author')}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            color: 'text.secondary',
                          }}
                        >
                          {t('login.testimonial.role')}
                        </Typography>
                      </Box>
                    </Box>
                    {/* Join count */}
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'primary.main',
                            fontSize: '12px',
                          }}
                        >
                          +
                        </Avatar>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: 'grey.400',
                            fontSize: '12px',
                          }}
                        >
                          ✓
                        </Avatar>
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                        {t('login.joinCount')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Right Column - Login Form */}
            <Grid size={{ xs: 12, md: lgUp ? 6 : 12 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: customizer.borderRadius / 18,
                  boxShadow: '0 2px 30px 15px rgba(37,83,185,.1)',
                  backgroundColor: 'white',
                  p: 4,
                }}
              >
                <AuthLogin
                  title={t('login.title')}
                  onSubmit={handleLoginSubmit}
                />
                {isLoading && <Loading />}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PageContainer>
  );
}

Login.layout = 'Blank';
