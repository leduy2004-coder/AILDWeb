import React from 'react';
import UserModule from '@/modules/admin/user';

export const metadata = {
  title: 'Quản lý người dùng | AILD',
  description: 'Quản lý danh sách người dùng trong hệ thống AILD',
};

export default function UsersPage() {
  return <UserModule />;
}
