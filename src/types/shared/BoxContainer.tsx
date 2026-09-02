import { Box, Divider, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  header?: ReactNode;
  children: ReactNode;
  bodySx?: SxProps;
  headerSx?: SxProps;
  sxProp?: SxProps;
};

export function BoxContainer({
  title,
  header,
  children,
  bodySx,
  headerSx,
  sxProp,
}: Props) {
  return (
    <Box
      sx={{
        height: '100%',
        mt: 1,
        width: '100%',
        // borderRadius: '5px !important',
        ...sxProp,
      }}
    >
      {/* --------header-------- */}
      <Box
        component={Paper}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 4,
          px: 3,
          borderRadius: '11px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          height: '42px',
          boxShadow: 'none',
          // borderBottom: '1px solid #cccccc',
          ...headerSx,
        }}
      >
        {title && <Typography variant="h5">{title}</Typography>}
        {header && header}
      </Box>
      {/* --------body-------- */}
      <Divider />
      <Paper
        elevation={3}
        sx={{
          borderRadius: '11px',
          borderTopLeftRadius: '0',
          borderTopRightRadius: '0',
          height: 'calc(100% - 42px)',
          ...bodySx,
          boxShadow: 'none',
          marginTop: '0px',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}
