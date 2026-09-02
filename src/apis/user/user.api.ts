import http from '@/lib/http';
import { IApiResponse, IPageResponse } from '@/types/shared';
import { IUser, IUserStats, IUserRequest, IUserUpdateRequest } from '@/types/users/user.type';

async function getUserStats(): Promise<IApiResponse<IUserStats>> {
  const { payload } = await http.get<IApiResponse<IUserStats>>(
    '/api/v1/auth/users/status'
  );

  return payload;
}

async function getUserById(id: number): Promise<IApiResponse<IUser>> {
  const { payload } = await http.get<IApiResponse<IUser>>(
    `/api/v1/auth/users/get-user?id=${id}`
  );
  return payload;
}

async function searchUsers(
  page: number = 1,
  size: number = 10,
  name?: string,
  email?: string,
): Promise<IApiResponse<IPageResponse<IUser>>> {
  const query = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (name) query.append('name', name);
  if (email) query.append('email', email);

  const { payload } = await http.get<IApiResponse<IPageResponse<IUser>>>(
    `/api/v1/auth/users/search?${query.toString()}`
  );

  return payload;
}

async function createUser(data: IUserRequest): Promise<IApiResponse<IUser>> {
  const { payload } = await http.post<IApiResponse<IUser>>(
    '/api/v1/auth/users/add-user',
    data
  );
  return payload;
}

async function updateUser(data: IUserUpdateRequest): Promise<IApiResponse<IUser>> {
  const { payload } = await http.post<IApiResponse<IUser>>(
    '/api/v1/auth/users/update-user',
    data
  );
  return payload;
}

async function deleteUsers(ids: number[]): Promise<IApiResponse<boolean>> {
  const { payload } = await http.delete<IApiResponse<boolean>>(
    '/api/v1/auth/users/delete-user',
    ids
  );
  return payload;
}

export const UserApi = {
  getUserStats,
  getUserById,
  searchUsers,
  createUser,
  updateUser,
  deleteUsers
};
