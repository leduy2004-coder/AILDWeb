import { Box, Typography } from '@mui/material';
import React from 'react';

interface CustomToastProps {
  title: string;
  message: string;
}

const CustomToast: React.FC<CustomToastProps> = ({ title, message }) => {
  return (
    <Box sx={{ ml: 1 }}>
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#444' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default CustomToast;
