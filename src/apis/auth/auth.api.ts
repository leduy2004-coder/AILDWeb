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
import { API_PREFIX } from '@/constants/api.constant';

export async function login(body: LoginBodyType): Promise<LoginRes> {
  const { payload } = await http.post<LoginRes>(
    `${API_PREFIX.AUTH}/login`,
    body,
  );

  return payload;
}

export async function loginGoogle(code: string): Promise<LoginRes> {
  const { payload } = await http.post<LoginRes>(
    `${API_PREFIX.AUTH}/login/oauth2?code=${code}`,
    {},
  );

  return payload;
}

export async function register(body: RegisterBodyType): Promise<RegisterResType> {
  const { payload } = await http.post<RegisterResType>(
    `${API_PREFIX.AUTH}/register`,
    body,
  );

  return payload;
}


export async function getInfoByUsername(): Promise<IApiResponse<IUser>> {
  const { payload } = await http.get<IApiResponse<IUser>>(
    `${API_PREFIX.AUTH}/users/get-user`,
  );

  return payload;
}

export async function checkUserTypeByUsername(
  username: string,
): Promise<IApiResponse<number>> {
  const { payload } = await http.get<IApiResponse<number>>(
    `${API_PREFIX.AUTH}/users/check-user-type/` + username,
  );

  return payload;
}

export async function checkEmailExist(
  email: string,
): Promise<IApiResponse<boolean>> {
  const { payload } = await http.get<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/check-email?email=` + email,
  );

  return payload;
}

export async function logout(): Promise<IApiResponse<void>> {
  const { payload } = await http.post<IApiResponse<void>>(
    `${API_PREFIX.AUTH}/logout`,
    {},
  );

  return payload;
}
