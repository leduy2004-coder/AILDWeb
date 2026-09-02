import Typography from '@mui/material/Typography';

import { loginType } from '@/app/(DashboardLayout)/types/auth/auth';

const AuthSocialLogin = ({ title, subtext }: loginType) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}
  </>
);

export default AuthSocialLogin;
