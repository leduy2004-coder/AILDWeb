import { createTheme } from '@mui/material';

const customBreakpointTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 440,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
});

export default customBreakpointTheme;
