import React from 'react';
import SubmissionsModule from '@/modules/admin/submissions';

export const metadata = {
  title: 'Quản lý bài nộp | AILD',
  description: 'Xem và quản lý các bài nộp của học viên trong hệ thống AILD',
};

export default function SubmissionsPage() {
  return <SubmissionsModule />;
}
