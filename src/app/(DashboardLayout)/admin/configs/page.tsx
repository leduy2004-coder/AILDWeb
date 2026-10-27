import React from 'react';
import AdminConfigPage from '@/modules/admin/config';

export const metadata = {
  title: 'Cấu hình hệ thống | AILD',
  description: 'Quản lý cấu hình và thông số hệ thống AILD',
};

export default function Page() {
  return <AdminConfigPage />;
}
