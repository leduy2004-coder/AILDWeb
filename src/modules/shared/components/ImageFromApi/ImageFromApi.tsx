"use client";
import React from 'react';
import { Box, BoxProps, CircularProgress } from '@mui/material';
import { useGetFileByUuid } from '@/apis/file/hook/useGetFile';

interface ImageFromApiProps extends BoxProps {
  uuid?: string | null;
  fallbackSrc?: string;
  alt?: string;
}

export const ImageFromApi: React.FC<ImageFromApiProps> = ({ 
  uuid, 
  fallbackSrc = '/images/no-image.jpg', 
  alt = 'Image',
  ...boxProps 
}) => {
  const { data, isLoading, isError } = useGetFileByUuid(uuid);

  const imageUrl = data?.result?.url || fallbackSrc;

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        {...boxProps}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={isError && fallbackSrc ? fallbackSrc : imageUrl}
      alt={alt}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.currentTarget;
        if (fallbackSrc && !target.src.endsWith(fallbackSrc)) {
          target.src = fallbackSrc;
        }
      }}
      {...boxProps}
    />
  );
};
