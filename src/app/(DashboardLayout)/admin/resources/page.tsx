import React from 'react';
import ResourceModule from '@/modules/admin/resource';

export const metadata = {
  title: 'Quản lý tài nguyên | AILD',
  description: 'Quản lý tài liệu và tài nguyên học tập trong hệ thống AILD',
};

export default function ResourcesPage() {
  return <ResourceModule />;
}
