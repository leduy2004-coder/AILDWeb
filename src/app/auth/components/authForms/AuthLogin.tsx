import Link from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { loginType } from '@/app/(DashboardLayout)/types/auth/auth';
import { useFormLogin } from '../../schemas/login.schema';
import AuthSocialButtons from './AuthSocialButtons';
import { Controller, SubmitHandler } from 'react-hook-form';
import { ISigningBody } from '@/types/shared';
import { useState } from 'react';
import { Box, IconButton, InputAdornment, Divider } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface AuthLoginProps extends loginType {
  onSubmit?: SubmitHandler<ISigningBody>;
}

const AuthLogin = ({ title, subtitle, subtext, onSubmit }: AuthLoginProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useFormLogin();
  const handleFormSubmit: SubmitHandler<ISigningBody> = async (data) => {
    if (onSubmit) await onSubmit(data);
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <Box>
      {/* Title and Description */}
      {title && (
        <Typography
          fontWeight="700"
          variant="h3"
          mb={1}
          textAlign="center"
          sx={{
            fontSize: { xs: '24px', sm: '28px' },
          }}
        >
          {title}
        </Typography>
      )}

      {subtext && (
        <Box textAlign="center">
          {subtext}
        </Box>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack spacing={2}>
          {/* Username */}
          <Box>
            <Typography
              fontSize={14}
              fontWeight={600}
              color="text.primary"
              mb={1}
              textAlign="left"
            >
              {t('login.email.title')}
            </Typography>

            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  id="email"
                  placeholder={t('login.email.placeholder')}
                  error={!!error}
                  helperText={<span>{error?.message || ''}</span>}
                />
              )}
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography
              fontSize={14}
              fontWeight={600}
              color="text.primary"
              mb={1}
              textAlign="left"
            >
              {t('login.password.title')}
            </Typography>

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login.password.placeholder')}
                  error={!!error}
                  helperText={<span>{error?.message || ''}</span>}
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

          {/* Forgot Password */}
          <Typography
            component={Link}
            href="/auth/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontSize: '14px',
              textAlign: 'right',
              display: 'block',
            }}
          >
            {t('login.forgotPasswordLink')}
          </Typography>

          {/* Submit button */}
          <Button
            color="primary"
            variant="contained"
            size="large"
            type="submit"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: '25px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            {t('login.loginButton')}
          </Button>
        </Stack>
      </form>

      {/* Divider */}
      <Box my={3}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="body2"
            fontWeight="400"
          >
            {t('login.or')}
          </Typography>
        </Divider>
      </Box>

      {/* Social Buttons */}
      <AuthSocialButtons title={t('login.orSignUpWith')} />

      {/* Sign Up Link */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {t('login.dontHaveAccount')}{' '}
          <Typography
            component={Link}
            href="/auth/register"
            fontWeight="600"
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
            }}
          >
            {t('login.signupButton')}
          </Typography>
        </Typography>
      </Box>

      {subtitle}
    </Box>
  );
};

export default AuthLogin;
