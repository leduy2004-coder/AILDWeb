import React from 'react';
import ProfileModule from '@/modules/public/profile';

export const metadata = {
  title: 'Hồ sơ cá nhân | AILD',
  description: 'Quản lý thông tin hồ sơ cá nhân',
};

export default function ProfilePage() {
  return <ProfileModule />;
}
