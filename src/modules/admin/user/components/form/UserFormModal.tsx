import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  IconButton,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { IconX, IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { getUserSchema, UserFormValues } from '../../schema/user.schema';
import { USER_ROLE_OPTIONS } from '../../constant/user.constant';
import { IUser, IUserRequest, IUserUpdateRequest } from '@/types/users/user.type';
import { useCreateUser, useUpdateUser } from '@/apis/user/hook';

interface Props {
  open: boolean;
  onClose: () => void;
  detailData?: IUser | null;
  isEdit?: boolean;
}

export default function UserFormModal({ open, onClose, detailData, isEdit }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'admin_user' });

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();

  const schema = getUserSchema(t, isEdit);

  const getRoleCode = (role?: IUser['role']): string => {
    if (!role) return 'STUDENT';
    if (typeof role === 'string') return role;
    if (typeof role === 'object' && role.code) return role.code;
    return 'STUDENT';
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      roleCode: 'STUDENT',
      status: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (isEdit && detailData) {
        reset({
          name: detailData.name || '',
          email: detailData.email || '',
          password: '********',
          roleCode: getRoleCode(detailData.role),
          status: detailData.status !== false,
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          roleCode: 'STUDENT',
          status: true,
        });
      }
    }
  }, [open, isEdit, detailData, reset]);

  const onSubmit = (data: UserFormValues) => {
    if (isEdit && detailData) {
      const updateData: IUserUpdateRequest = {
        id: detailData.id,
        name: data.name,
        email: detailData.email,
        status: data.status,
        role: { code: data.roleCode },
        password: data.password && data.password !== '********' ? data.password : undefined,
      };

      updateMutation.mutate(updateData, {
        onSuccess: () => {
          toast.success(t('form.successEdit'));
          onClose();
        },
        onError: () => toast.error(t('form.error')),
      });
    } else {
      const createData: IUserRequest = {
        name: data.name,
        email: data.email || '',
        password: data.password || '',
        status: data.status,
        role: { code: data.roleCode },
      };

      createMutation.mutate(createData, {
        onSuccess: () => {
          toast.success(t('form.successAdd'));
          onClose();
        },
        onError: () => toast.error(t('form.error')),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {isEdit ? t('form.editTitle') : t('form.addTitle')}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <IconX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            {/* Name Field */}
            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                {t('form.name')}
              </Typography>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder={t('form.namePlaceholder')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Box>

            {/* Email Field */}
            <Box>
              <Box mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {t('form.email')}
                </Typography>
                {isEdit && (
                  <Typography variant="caption" color="text.secondary">
                    {t('form.emailDisabledNote')}
                  </Typography>
                )}
              </Box>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    disabled={isEdit}
                    placeholder={t('form.emailPlaceholder')}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Box>

            {/* Password Field */}
            <Box>
              <Box mb={0.5}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {t('form.password')}
                </Typography>
                {isEdit && (
                  <Typography variant="caption" color="text.secondary">
                    {t('form.passwordEditNote')}
                  </Typography>
                )}
              </Box>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('form.passwordPlaceholder')}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* Role Select & Status Switch */}
            <Box display="flex" gap={2} alignItems="center">
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  {t('form.role')}
                </Typography>
                <Controller
                  name="roleCode"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.roleCode}>
                      <Select {...field}>
                        {USER_ROLE_OPTIONS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.roleCode && <FormHelperText>{errors.roleCode.message}</FormHelperText>}
                    </FormControl>
                  )}
                />
              </Box>

              <Box flex={1} pt={2}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={500}>
                          {field.value ? t('status.active') : t('status.inactive')}
                        </Typography>
                      }
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t('form.cancel')}
        </Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          color="primary"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {t('form.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
