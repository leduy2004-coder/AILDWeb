import SimpleBar from 'simplebar-react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';

const SimpleBarStyle = styled(SimpleBar)(() => ({
  maxHeight: '100%',
  '& .simplebar-content-wrapper': {
    overscrollBehavior: 'contain', // Fix safari scroll chaining
  },
}));

interface PropsType {
  children: React.ReactElement | React.ReactNode;
  sx: SxProps;
}

const Scrollbar = (props: PropsType) => {
  const { children, sx, ...other } = props;

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) {
    return <Box sx={{ overflowX: 'auto' }}>{children}</Box>;
  }

  return (
    <SimpleBarStyle sx={sx} {...other}>
      {children}
    </SimpleBarStyle>
  );
};

export default Scrollbar;
