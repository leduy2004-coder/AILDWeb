import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, Select, MenuItem, FormHelperText, Box, Typography, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { IconX, IconMaximize } from '@tabler/icons-react';
import { getResourceSchema } from '../../schema/resource.schema';
import { IResource, IResourceRequest } from '@/types/admin/resource.type';
import ExpandFieldModal from '@/modules/admin/question/components/modal/ExpandFieldModal';
import { useCreateResource, useUpdateResource } from '@/apis/resource/hook';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
  detailData?: IResource | null;
  isEdit?: boolean;
}

export default function ResourceForm({ open, onClose, detailData, isEdit }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'admin_resource.form' });
  const { t: tDomain } = useTranslation('translation', { keyPrefix: 'admin_overview.domain.name' });
  const { t: tLevel } = useTranslation('translation', { keyPrefix: 'admin_overview.level.name' });

  const [expandModalField, setExpandModalField] = useState<'description' | null>(null);

  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();

  const schema = getResourceSchema(t);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<IResourceRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      url: '',
      domainId: 1,
      targetLevelId: 1,
      description: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (isEdit && detailData) {
        reset({
          title: detailData.title,
          url: detailData.url,
          domainId: detailData.domainId,
          targetLevelId: detailData.targetLevelId,
          description: detailData.description || ''
        });
      } else {
        reset({
          title: '',
          url: '',
          domainId: 1,
          targetLevelId: 1,
          description: ''
        });
      }
    }
  }, [open, isEdit, detailData, reset]);

  const onSubmit = (data: IResourceRequest) => {
    if (isEdit && detailData) {
      updateMutation.mutate({ id: detailData.id, data }, {
        onSuccess: () => {
          toast.success(t('successEdit'));
          onClose();
        },
        onError: () => toast.error(t('error'))
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('successAdd'));
          onClose();
        },
        onError: () => toast.error(t('error'))
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">{isEdit ? t('editTitle') : t('addTitle')}</Typography>
          <IconButton onClick={onClose} size="small"><IconX /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          <form id="resource-form" onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('title')}</Typography>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder={t('titlePlaceholder')}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  )}
                />
              </Box>

              <Box>
                <Box mb={1}>
                  <Typography variant="subtitle2" fontWeight={600}>{t('url')}</Typography>
                  <Typography variant="caption" color="text.secondary">{t('urlNote')}</Typography>
                </Box>
                <Controller
                  name="url"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder={t('urlPlaceholder')}
                      error={!!errors.url}
                      helperText={errors.url?.message}
                    />
                  )}
                />
              </Box>

              <Box display="flex" gap={2}>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('domain')}</Typography>
                  <Controller
                    name="domainId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.domainId}>
                        <Select {...field}>
                          <MenuItem value={1}>{tDomain('1')}</MenuItem>
                          <MenuItem value={2}>{tDomain('2')}</MenuItem>
                          <MenuItem value={3}>{tDomain('3')}</MenuItem>
                          <MenuItem value={4}>{tDomain('4')}</MenuItem>
                        </Select>
                        {errors.domainId && <FormHelperText>{errors.domainId.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle2" fontWeight={600} mb={1}>{t('level')}</Typography>
                  <Controller
                    name="targetLevelId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.targetLevelId}>
                        <Select {...field}>
                          <MenuItem value={1}>{tLevel('1')}</MenuItem>
                          <MenuItem value={2}>{tLevel('2')}</MenuItem>
                          <MenuItem value={3}>{tLevel('3')}</MenuItem>
                        </Select>
                        {errors.targetLevelId && <FormHelperText>{errors.targetLevelId.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle2" fontWeight={600}>{t('description')}</Typography>
                  <IconButton size="small" onClick={() => setExpandModalField('description')} title="Phóng to">
                    <IconMaximize size={18} />
                  </IconButton>
                </Box>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder={t('descriptionPlaceholder')}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Box>
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">{t('cancel')}</Button>
          <Button type="submit" form="resource-form" variant="contained" color="primary" disabled={createMutation.isPending || updateMutation.isPending}>
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      {expandModalField && (
        <ExpandFieldModal
          open={Boolean(expandModalField)}
          onClose={() => setExpandModalField(null)}
          title={t('description')}
          placeholder={t('descriptionPlaceholder')}
          name={expandModalField}
          control={control}
        />
      )}
    </>
  );
}
