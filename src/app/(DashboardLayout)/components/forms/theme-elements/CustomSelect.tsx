import React from 'react';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import { AnyType } from '@/types/shared';

const CustomSelect = styled((props: AnyType) => <Select {...props} />)(
   
  ({ theme }) => ({
    '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
      color: theme.palette.text.secondary,
      opacity: '0.5',
    },
  }),
);

export default CustomSelect;
