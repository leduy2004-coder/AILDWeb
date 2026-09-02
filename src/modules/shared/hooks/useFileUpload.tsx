import { useState, useCallback } from 'react';
import { showErrorToast } from '@/modules/shared/components/toasts/ToastHelper';
import { useTranslation } from 'react-i18next';

interface UseFileUploadOptions {
  validTypes?: string[];
  onFileSelect?: (file: File) => void | Promise<void>;
  invalidFileTypeMessageKey?: string;
}

export const useFileUpload = ({
  validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  onFileSelect,
  invalidFileTypeMessageKey = 'stores.import.message.invalid_file_type',
}: UseFileUploadOptions = {}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSelectFile = useCallback(
    async (file: File) => {
      if (!file) return;

      if (!validTypes.includes(file.type)) {
        showErrorToast(
          t('common.message.server_error.title'),
          t(invalidFileTypeMessageKey),
        );
        return;
      }

      setSelectedFile(file);
      if (onFileSelect) {
        await onFileSelect(file);
      }
    },
    [validTypes, onFileSelect, t, invalidFileTypeMessageKey],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) {
        validateAndSelectFile(file);
      }
    },
    [validateAndSelectFile],
  );

  const resetFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return {
    selectedFile,
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    validateAndSelectFile,
    resetFile,
    setSelectedFile,
  };
};
