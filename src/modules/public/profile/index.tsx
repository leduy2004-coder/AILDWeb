'use client';

import React, { useEffect, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { getLocalStorageItem } from '@/modules/shared/utils';
import { AuthActionTypes } from '@/types/shared';
import { useUpdateUser } from '@/apis/user/hook/useUpdateUser';
import { useGetUserById } from '@/apis/user/hook/useGetUserById';
import ProfileForm from './components/ProfileForm';
import { ProfileFormValues } from './schema/profile.schema';

export default function ProfileModule() {
  const { t } = useTranslation();
  const router = useRouter();
  const [userId, setUserId] = React.useState<number | null>(null);

  useEffect(() => {
    const userInfoStr = getLocalStorageItem<string>(AuthActionTypes.USER_INFO);
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        setUserId(userInfo.id ?? userInfo.userId ?? null);
      } catch (e) {
        console.error(e);
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const { data: userResponse, isLoading } = useGetUserById(userId ?? undefined);
  const updateMutation = useUpdateUser();

  const initialValues = useMemo<ProfileFormValues>(
    () => ({
      name: userResponse?.result?.name ?? '',
      age: (userResponse?.result?.age ?? '') as any,
      major: userResponse?.result?.major ?? '',
    }),
    [userResponse],
  );

  const handleSave = (data: ProfileFormValues) => {
    if (!userId) return;

    const ageValue = data.age === '' ? undefined : Number(data.age);
    const majorValue = data.major === '' ? undefined : data.major;

    updateMutation.mutate(
      { id: userId, name: data.name, age: ageValue, major: majorValue },
      {
        onSuccess: () => {
          toast.success(t('profile.success', 'Cập nhật hồ sơ thành công'));

          // Sync updated info to localStorage
          const userInfoStr = getLocalStorageItem<string>(AuthActionTypes.USER_INFO);
          if (userInfoStr) {
            try {
              const parsed = JSON.parse(userInfoStr);
              localStorage.setItem(
                AuthActionTypes.USER_INFO,
                JSON.stringify({ ...parsed, name: data.name, age: ageValue, major: majorValue }),
              );
            } catch (_) {}
          }

          // Redirect back if this was a forced profile-update flow
          const redirectUrl = sessionStorage.getItem('redirectAfterProfileUpdate');
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterProfileUpdate');
            router.push(redirectUrl);
          }
        },
        onError: () => {
          toast.error(t('profile.error', 'Có lỗi xảy ra khi cập nhật hồ sơ'));
        },
      },
    );
  };

  if (isLoading || !userId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" py={{ xs: 4, md: 6 }} px={{ xs: 2, md: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" color="primary.main" sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
        {t('profile.title', 'Hồ sơ cá nhân')}
      </Typography>

      <ProfileForm
        email={userResponse?.result?.email}
        initialValues={initialValues}
        isSaving={updateMutation.isPending}
        onSave={handleSave}
      />
    </Box>
  );
}
