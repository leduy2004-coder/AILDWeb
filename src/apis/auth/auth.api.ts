import http from '@/lib/http';
import {
  IApiResponse,
  LoginBodyType,
  RegisterBodyType,
  AuthBodyType,
  LoginRes,
  RegisterResType,
} from '@/types/shared';
import { IUser } from '@/types/users/user.type';

export async function login(body: LoginBodyType): Promise<LoginRes> {
  const { payload } = await http.post<LoginRes>(
    '/api/v1/auth/login',
    body,
  );

  return payload;
}

export async function loginGoogle(code: string): Promise<LoginRes> {
  const { payload } = await http.post<LoginRes>(
    `/api/v1/auth/login/oauth2?code=${code}`,
    {},
  );

  return payload;
}

export async function register(body: RegisterBodyType): Promise<RegisterResType> {
  const { payload } = await http.post<RegisterResType>(
    '/api/v1/auth/register',
    body,
  );

  return payload;
}


export async function getInfoByUsername(): Promise<IApiResponse<IUser>> {
  const { payload } = await http.get<IApiResponse<IUser>>(
    '/api/v1/auth/users/get-user',
  );

  return payload;
}

export async function checkUserTypeByUsername(
  username: string,
): Promise<IApiResponse<number>> {
  const { payload } = await http.get<IApiResponse<number>>(
    '/api/v1/auth/users/check-user-type/' + username,
  );

  return payload;
}

export async function checkEmailExist(
  email: string,
): Promise<IApiResponse<boolean>> {
  const { payload } = await http.get<IApiResponse<boolean>>(
    '/api/v1/auth/check-email?email=' + email,
  );

  return payload;
}

export async function logout(): Promise<IApiResponse<void>> {
  const { payload } = await http.post<IApiResponse<void>>(
    '/api/v1/auth/logout',
    {},
  );

  return payload;
}
