import { Button } from '@mui/material';
import { styled } from '@mui/system';

export const ActionButton = styled(Button)(({ color }) => ({
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
  }),

  '& .MuiButton-root': {
    borderRadius: 5,
  },
}));
