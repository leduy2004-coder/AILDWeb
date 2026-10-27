import React from 'react';
import { SubmissionDetailWrapper } from '@/modules/admin/submissions/detail/SubmissionDetailWrapper';

export const metadata = {
  title: 'Chi tiết bài nộp | AILD',
  description: 'Xem chi tiết kết quả bài kiểm tra của học viên',
};

export default function SubmissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!id) return null;
  return <SubmissionDetailWrapper id={id} />;
}
