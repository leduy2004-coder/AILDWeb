import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Stack, IconButton, InputAdornment, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerType } from '@/app/(DashboardLayout)/types/auth/auth';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { ROLE_CODE } from '@/modules/shared/constants';
import { register as registerApi, checkEmailExist } from '@/apis/auth';
import { showErrorToast, showSuccessToast } from '@/modules/shared/components/toasts/ToastHelper';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import AuthSocialButtons from './AuthSocialButtons';
import Link from 'next/link';

interface RegisterFormData {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const password = watch('password');

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const onFinalSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsRegistering(true);
    try {
      // Step 1: Check email
      const emailRes = await checkEmailExist(data.email as string);
      if (emailRes.code === 1000 && emailRes.result) {
        showErrorToast(t('register.messages.errorTitle'), t('register.messages.emailExist'));
        setIsRegistering(false);
        return;
      }

      // Step 2: Register user
      const payload = {
        email: data.email as string,
        password: data.password as string,
        name: data.name,
        role: { code: ROLE_CODE.STUDENT },
      };

      const res = await registerApi(payload as any);
      if (res.code === 1000 || res.result) {
        showSuccessToast(t('register.messages.successTitle'), t('register.messages.registerSuccess'));
        router.push('/auth/login');
      } else {
        showErrorToast(t('register.messages.errorTitle'), t('register.messages.registerFailed'));
      }
    } catch (error) {
      showErrorToast(t('register.messages.errorTitle'), t('register.messages.registerError'));
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Box>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1} textAlign="center" sx={{ fontSize: { xs: '24px', sm: '28px' } }}>
          {title}
        </Typography>
      )}

      {subtext && <Box textAlign="center" mb={3}>{subtext}</Box>}

      <form onSubmit={handleSubmit(onFinalSubmit)}>
        <Stack spacing={2}>
          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={1} textAlign="left">{t('register.step1.fullName')}</Typography>
            <Controller
              name="name"
              control={control}
              rules={{ required: t('register.step1.fullNameRequired') as string }}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth placeholder={t('register.step1.fullNamePlaceholder')} error={!!errors.name} helperText={errors.name?.message} />
              )}
            />
          </Box>

          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={1} textAlign="left">{t('login.email.title')}</Typography>
            <Controller
              name="email"
              control={control}
              rules={{
                required: t('register.step1.emailRequired') as string,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('register.step1.emailInvalid') },
              }}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth type="email" placeholder={t('login.email.placeholder')} error={!!errors.email} helperText={errors.email?.message} />
              )}
            />
          </Box>

          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={1} textAlign="left">{t('login.password.title')}</Typography>
            <Controller
              name="password"
              control={control}
              rules={{ required: t('register.step1.passwordRequired') as string, minLength: { value: 8, message: t('register.step1.passwordMinLength') } }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.password.placeholder')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography fontSize={14} fontWeight={600} color="text.primary" mb={1} textAlign="left">{t('login.confirmPassword.title')}</Typography>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: t('register.step1.confirmPasswordRequired') as string,
                validate: (value) => value === password || (t('register.step1.passwordMismatch') as string),
              }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('login.confirmPassword.placeholder')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Box>

          <LoadingButton
            color="primary"
            variant="contained"
            size="large"
            type="submit"
            fullWidth
            loading={isRegistering}
            sx={{ py: 1.5, borderRadius: '25px', textTransform: 'none', fontSize: '16px', fontWeight: '600', mt: 2 }}
          >
            {t('registerButton', { ns: 'translation' }) || 'Đăng ký tài khoản'}
          </LoadingButton>
        </Stack>
      </form>

      <Box my={3}>
        <Divider>
          <Typography component="span" color="textSecondary" variant="body2" fontWeight="400">{t('login.or')}</Typography>
        </Divider>
      </Box>
      <AuthSocialButtons title={t('login.orSignUpWith')} />

      {subtitle}
    </Box>
  );
};

export default AuthRegister;
