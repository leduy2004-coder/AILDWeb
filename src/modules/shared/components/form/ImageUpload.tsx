import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  FormHelperText,
} from '@mui/material';
import FileFromApi from '../FileFromApi/FileFromApi';
import { useTranslation } from 'react-i18next';
import { ImagePreview } from './ImagePreview';
import { MAX_FILE_SIZE_IMG } from '../../constants';

interface ImageUploadProps {
  maxFiles?: number;
  oldIds?: string[];
  newFiles?: File[];
  onChange?: (files: File[]) => void;
  onRemoveOld?: (id: string) => void;
  error?: boolean;
  helperText?: string;
  note?: string;
  noImagesText?: string;
  button: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  maxFiles = 3,
  oldIds = [],
  newFiles = [],
  onChange,
  onRemoveOld,
  error = false,
  helperText = '',
  note = '',
  noImagesText = '',
  button,
  disabled,
}) => {
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string>('');
  const { t } = useTranslation();

  const totalCount = oldIds.length + newFiles.length;

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const canAdd = maxFiles - totalCount;

    if (files.length > maxFiles || files.length > canAdd) {
      setLocalError(t('common.validation.maxFiles', { max: maxFiles }));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (canAdd <= 0) return;

    const validFiles: File[] = [];
    let errorMsg = '';

    for (const file of Array.from(files)) {
      const allowedExtensions = ['.jpeg', '.jpg', '.png'];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf('.'));
      if (!allowedExtensions.includes(fileExtension)) {
        errorMsg = t('common.validation.imageFormat');
        break;
      }

      if (file.size > MAX_FILE_SIZE_IMG) {
        errorMsg = t('common.validation.imageSize');
        break;
      }

      validFiles.push(file);
    }

    if (errorMsg) {
      setLocalError(errorMsg);
    } else {
      setLocalError('');
      onChange?.([...newFiles, ...validFiles]);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveNew = (index: number) => {
    const updated = newFiles.filter((_, i) => i !== index);
    onChange?.(updated);
  };

  return (
    <Box>
      {note && (
        <Typography variant="body2" color="text.secondary" mb={1}>
          {note}
        </Typography>
      )}

      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ background: '#f7f7f7', p: 2, borderRadius: 1 }}
      >
        <Button
          variant="outlined"
          component="label"
          disabled={disabled || totalCount >= maxFiles}
        >
          {button}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            accept=".jpeg,.jpg,.png"
            onChange={(e) => handleFileChange(e.target.files)}
          />
        </Button>

        {totalCount === 0 && (
          <Typography variant="body2" color="text.secondary">
            {noImagesText}
          </Typography>
        )}
      </Box>

      <Box mt={2} display="flex" flexWrap="wrap" gap={3}>
        {oldIds.map((id) => (
          <Box key={id} display="flex" alignItems="center" gap={1}>
            <Box
              position="relative"
              width={120}
              height={80}
              borderRadius={0}
              overflow="hidden"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <FileFromApi
                fileId={id}
                alt={`image-${id}`}
                onLoad={(filename) =>
                  setFileNames((prev) => ({ ...prev, [id]: filename }))
                }
              />

              {!disabled && (
                <IconButton
                  size="small"
                  onClick={() => onRemoveOld?.(id)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#f44336',
                    color: '#fff',
                    width: 20,
                    height: 20,
                    '&:hover': { backgroundColor: '#d32f2f' },
                  }}
                >
                  ×
                </IconButton>
              )}
            </Box>
            {fileNames[id] && (
              <Typography variant="body2">{fileNames[id]}</Typography>
            )}
          </Box>
        ))}

        {newFiles.map((file, index) => (
          <Box
            key={`${file.name}-${index}`}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box
              position="relative"
              width={120}
              height={80}
              borderRadius={0}
              overflow="hidden"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <ImagePreview file={file} />

              <IconButton
                size="small"
                disabled={disabled}
                onClick={() => handleRemoveNew(index)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: '#f44336',
                  color: '#fff',
                  width: 20,
                  height: 20,
                  '&:hover': { backgroundColor: '#d32f2f' },
                }}
              >
                ×
              </IconButton>
            </Box>

            <Typography variant="body2">{file.name}</Typography>
          </Box>
        ))}
      </Box>

      {(localError || (error && helperText)) && (
        <FormHelperText error sx={{ mt: 1 }}>
          {localError || helperText}
        </FormHelperText>
      )}
    </Box>
  );
};
