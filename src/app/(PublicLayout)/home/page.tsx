import React from 'react';
import HomePageClient from '@/modules/public/home/HomePageClient';

export const metadata = {
  title: 'Trang chủ | AILD',
  description: 'Tổng quan học tập và tiến trình của sinh viên trên hệ thống AILD',
};

export default function HomePage() {
  return <HomePageClient />;
}
