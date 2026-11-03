'use client';

import React from 'react';
import SourceDocumentDetailModule from './index';

interface Props {
  id: number;
}

export function SourceDocumentDetailWrapper({ id }: Props) {
  return <SourceDocumentDetailModule id={id} />;
}
