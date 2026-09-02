import { AnyType } from '@/types/shared';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const CustomSocialButton = styled((props: AnyType) => (
  <Button variant="outlined" size="large" color="inherit" {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

export default CustomSocialButton;
