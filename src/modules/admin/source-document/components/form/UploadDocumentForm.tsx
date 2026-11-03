import React, { useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, FormHelperText, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { IconX, IconFileTypePdf } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useUploadSourceDocument } from '@/apis/source-document/hook';
import { getUploadDocumentSchema, UploadDocumentFormValues } from '../../schema/source-document.schema';
import { DUPLICATE_DOCUMENT_ERROR_CODE, MAX_UPLOAD_MB } from '../../constant/source-document.constant';
import { HttpError } from '@/lib/http';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UploadDocumentForm({ open, onClose }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_source_document' });
  const uploadMutation = useUploadSourceDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // The parent mounts this dialog only while open, so the form starts empty each time
  const { control, handleSubmit, formState: { errors } } = useForm<UploadDocumentFormValues>({
    resolver: zodResolver(getUploadDocumentSchema(t)),
    defaultValues: { title: '', sourceName: '', publishedYear: undefined },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    e.target.value = '';
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setFileError(t('upload.validation.pdfOnly'));
      return;
    }
    if (selected.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setFileError(t('upload.validation.fileTooLarge', { size: MAX_UPLOAD_MB }));
      return;
    }
    setFile(selected);
    setFileError(null);
  };

  const onSubmit = (values: UploadDocumentFormValues) => {
    if (!file) {
      setFileError(t('upload.validation.fileRequired'));
      return;
    }
    uploadMutation.mutate(
      { file, title: values.title, sourceName: values.sourceName, publishedYear: values.publishedYear },
      {
        onSuccess: () => {
          toast.success(t('upload.success'));
          onClose();
        },
        onError: (err) => {
          const isDuplicate = err instanceof HttpError && Number(err.payload?.code) === DUPLICATE_DOCUMENT_ERROR_CODE;
          toast.error(t(isDuplicate ? 'upload.duplicate' : 'upload.error'));
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">{t('upload.title')}</Typography>
        <IconButton onClick={onClose} size="small"><IconX /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <form id="upload-document-form" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('upload.file')}</Typography>
              <input ref={fileInputRef} type="file" accept="application/pdf,.pdf" hidden onChange={handleFileChange} />
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  p: 2,
                  border: '1px dashed',
                  borderColor: fileError ? 'error.main' : 'divider',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' },
                }}
              >
                <IconFileTypePdf size={28} />
                <Typography variant="body2" color={file ? 'text.primary' : 'text.secondary'}>
                  {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : t('upload.filePlaceholder', { size: MAX_UPLOAD_MB })}
                </Typography>
              </Box>
              {fileError && <FormHelperText error>{fileError}</FormHelperText>}
              <Typography variant="caption" color="text.secondary">{t('upload.fileNote')}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('upload.docTitle')}</Typography>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth placeholder={t('upload.docTitlePlaceholder')} error={!!errors.title} helperText={errors.title?.message} />
                )}
              />
            </Box>

            <Box display="flex" gap={2}>
              <Box flex={2}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('upload.sourceName')}</Typography>
                <Controller
                  name="sourceName"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth placeholder={t('upload.sourceNamePlaceholder')} error={!!errors.sourceName} helperText={errors.sourceName?.message} />
                  )}
                />
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('upload.publishedYear')}</Typography>
                <Controller
                  name="publishedYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      placeholder="2024"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                      error={!!errors.publishedYear}
                      helperText={errors.publishedYear?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">{t('upload.cancel')}</Button>
        <Button type="submit" form="upload-document-form" variant="contained" color="primary" disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? <CircularProgress size={22} color="inherit" /> : t('upload.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
