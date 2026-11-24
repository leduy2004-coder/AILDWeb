import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ActionButton = styled(Button)(({ color, theme }) => ({
  fontSize: '13px !important',
  fontFamily: 'sans-serif',
  fontWeight: 500,
  ...(color === 'success' && {
    backgroundColor: '#00a65a',
    borderColor: '#398439',

    '&:hover': {
      backgroundColor: '#008d4c',
      color: '#ffffff',
      borderColor: '#398439',
    },

    '&:active': {
      backgroundColor: '#008d4c',
      color: '#ffffff',
      borderColor: '#398439',
    },

    // Without this the forced green background makes a disabled button look clickable
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
      borderColor: 'transparent',
    },
  }),

  '& .MuiButton-root': {
    borderRadius: 5,
  },
}));
