'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import SubmissionDetailModule from '@/modules/admin/submissions/detail';

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  if (!id) return null;

  return <SubmissionDetailModule id={id} />;
}
