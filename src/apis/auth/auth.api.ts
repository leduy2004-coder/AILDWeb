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
import { API_PREFIX } from '@/apis/constants/api.constant';

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

/** Why an OTP is being sent / checked; matches the backend OtpStatus enum */
export type OtpPurpose = 'REGISTER' | 'FORGET_PASS' | 'CHANGE_PASS';

export interface IVerifyOtpBody {
  email: string;
  otp: string;
  status: OtpPurpose;
}

export interface IResetPasswordBody {
  token: string;
  newPassword: string;
}

export async function verifyOtp(body: IVerifyOtpBody): Promise<IApiResponse<boolean>> {
  const { payload } = await http.post<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/email/verify-account`,
    body,
  );

  return payload;
}

export async function resendOtp(email: string, status: OtpPurpose): Promise<IApiResponse<boolean>> {
  const query = new URLSearchParams({ email, status });
  const { payload } = await http.post<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/email/generate-otp?${query}`,
    {},
  );

  return payload;
}

export async function forgotPassword(email: string): Promise<IApiResponse<boolean>> {
  const query = new URLSearchParams({ email });
  const { payload } = await http.post<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/forgot-password?${query}`,
    {},
  );

  return payload;
}

export async function validateResetToken(token: string): Promise<IApiResponse<boolean>> {
  const query = new URLSearchParams({ token });
  const { payload } = await http.get<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/reset-password/validate?${query}`,
  );

  return payload;
}

export async function resetPassword(body: IResetPasswordBody): Promise<IApiResponse<boolean>> {
  const { payload } = await http.post<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/reset-password`,
    body,
  );

  return payload;
}

export interface IChangePasswordBody {
  /** Current password */
  password: string;
  newPass: string;
}

/** Changes the signed-in user's password; the backend takes the user from the access token */
export async function changePassword(body: IChangePasswordBody): Promise<IApiResponse<boolean>> {
  const { payload } = await http.post<IApiResponse<boolean>>(
    `${API_PREFIX.AUTH}/change-pass`,
    body,
  );

  return payload;
}
