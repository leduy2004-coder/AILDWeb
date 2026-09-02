"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton, Stack, FormHelperText } from '@mui/material';
import { Close as CloseIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ImageFromApi } from '../ImageFromApi';

export interface MultipleImageUploadProps {
  existingUuids?: string[];
  newFiles?: File[];
  onChangeFiles?: (files: File[]) => void;
  onRemoveExisting?: (uuid: string) => void;
  error?: string;
  disabled?: boolean;
}

export const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  existingUuids = [],
  newFiles = [],
  onChangeFiles,
  onRemoveExisting,
  error,
  disabled,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const urls = newFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validImages = selectedFiles.filter(file => file.type.startsWith('image/'));
      if (onChangeFiles) {
        onChangeFiles([...newFiles, ...validImages]);
      }
    }
    // reset input so the same file can be selected again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNewFile = (index: number) => {
    if (onChangeFiles) {
      const updated = [...newFiles];
      updated.splice(index, 1);
      onChangeFiles(updated);
    }
  };

  return (
    <Box>
      <input
        type="file"
        multiple
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
      />
      
      <Button
        variant="outlined"
        color={error ? 'error' : 'primary'}
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        fullWidth
        sx={{ mb: 2, p: 2, borderStyle: 'dashed' }}
      >
        {t('common.upload_images', 'Click or drag images to upload')}
      </Button>

      {error && <FormHelperText error>{error}</FormHelperText>}

      <Stack direction="row" flexWrap="wrap" gap={2}>
        {/* Existing Images from API */}
        {existingUuids.map((uuid) => (
          <Box key={uuid} position="relative" width={100} height={100} border="1px solid #ddd" borderRadius={1} overflow="hidden">
            <ImageFromApi uuid={uuid} width="100%" height="100%" sx={{ objectFit: 'cover' }} />
            {!disabled && onRemoveExisting && (
              <IconButton
                size="small"
                onClick={() => onRemoveExisting(uuid)}
                sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}

        {/* Newly selected images (local preview) */}
        {newFiles.map((file, index) => {
          const objectUrl = previewUrls[index];
          return (
            <Box key={index} position="relative" width={100} height={100} border="1px solid #ddd" borderRadius={1} overflow="hidden">
              <Box component="img" src={objectUrl} width="100%" height="100%" sx={{ objectFit: 'cover' }} />
              {!disabled && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveNewFile(index)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'white' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
