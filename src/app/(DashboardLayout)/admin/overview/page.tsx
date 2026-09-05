import React from 'react';
import AdminOverviewModule from '@/modules/admin/overview';

export const metadata = {
  title: 'Bảng điều khiển Quản trị | AILD',
  description: 'Bảng điều khiển tổng quan dành cho quản trị viên.',
};

export default function AdminOverviewPage() {
  return <AdminOverviewModule />;
}
