'use client';

import React from 'react';
import SubmissionDetailModule from '../detail';

interface Props {
  id: number;
}

export function SubmissionDetailWrapper({ id }: Props) {
  return <SubmissionDetailModule id={id} />;
}
