import React from 'react';
import AssessmentPageClient from '@/modules/public/assessment/AssessmentPageClient';

export const metadata = {
  title: 'Kiểm tra đánh giá | AILD',
  description: 'Thực hiện bài kiểm tra đánh giá năng lực trên hệ thống AILD',
};

export default function AssessmentPage() {
  return <AssessmentPageClient />;
}
