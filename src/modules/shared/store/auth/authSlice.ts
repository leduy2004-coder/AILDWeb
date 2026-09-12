import { createAsyncThunk } from '@reduxjs/toolkit';

import { checkUserTypeByUsername, login } from '@/apis/auth';
import { AuthActionTypes, ISigningBody, LoginBodyType } from '@/types/shared/auth.type';
import { PATH_NAME, USER_TYPE, RoleType } from '@/modules/shared/constants';
import { setLocalStorageItems } from '@/modules/shared/utils';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { showErrorToast } from '../../components/toasts/ToastHelper';
export const signingSlice = createAsyncThunk(
  'auth/signin',
  async (signingBody: ISigningBody, { rejectWithValue }) => {
    try {

      const response = await login(signingBody as LoginBodyType);
      if (typeof window !== 'undefined') {
        const user = response.result.user;
        const userRole = typeof user?.role === 'string' ? user.role : (user?.role as any)?.code;

        let redirectPath = PATH_NAME.HOME;
        if (userRole === RoleType.ADMIN) {
          redirectPath = PATH_NAME.ADMIN;
        } else if (userRole === RoleType.TEACHER) {
          redirectPath = PATH_NAME.TEACHER;
        } else if (userRole === RoleType.STUDENT) {
          redirectPath = PATH_NAME.STUDENT;
        }

        setLocalStorageItems({
          [AuthActionTypes.ACCESS_TOKEN]: response.result.access_token,
          [AuthActionTypes.USER_INFO]: JSON.stringify(user),
          loginSuccessMessage: JSON.stringify({
            title: t('login.success.title'),
            message: t('login.success.message'),
          }),
        });
        window.location.replace(redirectPath);
      }
    } catch (e: any) {
      showErrorToast(t('login.failed.title'), e?.payload?.message || t('login.failed.message'));
      return rejectWithValue(e?.payload?.message || 'Login failed');
    }
  },
);
