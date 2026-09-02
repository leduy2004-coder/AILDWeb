'use client';

import { useState, useEffect } from 'react';

export const ImagePreview = ({ file }: { file: File }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <img
      src={src}
      alt={file.name}
      width="100%"
      height="100%"
      style={{
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        display: 'block',
        cursor: 'pointer',
      }}
    />
  );
};
