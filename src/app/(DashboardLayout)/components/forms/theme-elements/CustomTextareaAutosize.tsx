import React from 'react';
import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';
import { styled } from '@mui/system';

const CustomTextareaAutosize = styled((props: TextareaAutosizeProps) => (
  <TextareaAutosize {...props} />
))(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.default,
  border: '1px solid #B0B0B0',
  borderRadius: '4px',
  padding: '8px',
  fontSize: '14px',
  color: '#0000000',
  '&:focus': {
    outline: 'none',
    color: '#000',
  },
  '&:disabled': {
    backgroundColor: '#e6e6e6',
    borderColor: theme.palette.grey[300],
    color: '#000000',
    cursor: 'not-allowed',
  },
}));

export default CustomTextareaAutosize;
