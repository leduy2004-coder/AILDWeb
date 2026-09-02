import { IUser } from "../users/user.type";

// Auth Request Types
export type LoginBodyType = {
  email: string;
  password: string;
};

export interface RegisterBodyType {
  username: string;
  password: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthBodyType {
  sessionToken: string;
  expiresAt: string;
  role: string;
  [key: string]: unknown;
}

export interface ISigningBody {
  email: string;
  password: string;
}

export interface IDetailUserResponse {
  sub?: string;
  fullName?: string;
  email: string;
  phone: string;
  username: string;
  userType?: number;
  name?: string;
  id?: number;
  userId?: number;
}

export interface IDetailMail {
  email: string;
}

export interface IDetailSendMail {
  email: string | null;
  id: number;
}

export interface IRefreshTokenBody {
  refreshToken: string;
}

// Auth Response Types
export interface LoginRes {
  code: number;
  result: {
    access_token: string;
    user: IUser;
  };
}

export interface RegisterResType {
  code: number;
  result: {
    message: string;
  };
}

export interface IAuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: IUser;
}

export const enum AuthActionTypes {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  USER_NAME = 'USER_NAME',
  USER_INFO = 'USER_INFO',
  EMAIL = 'EMAIL',
}

