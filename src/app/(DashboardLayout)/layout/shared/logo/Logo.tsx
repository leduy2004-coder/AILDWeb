import { useSelector } from '@/store/hooks';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { AppState } from '@/store/store';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
import logoTutor from '@/assests/images/logo.png';

interface LogoProps {
  margin?: string;
  isSidebar?: boolean;
}

interface StyledProps {
  $collapse: boolean;
  $topbarHeight: number | string;
  margin?: string;
}

const LinkStyled = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== '$collapse' && prop !== '$topbarHeight' && prop !== 'margin',
})<StyledProps>(
  ({ $collapse, $topbarHeight, margin }) => ({
    height: $collapse ? '50px' : $topbarHeight,
    width: $collapse ? '100%' : '200px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: $collapse ? 'center' : 'flex-start',
    margin: margin || 'auto',
    zIndex: 99999,
    textDecoration: 'none',
  }),
);

export default function Logo({ margin, isSidebar }: LogoProps) {
  const customizerState = useSelector((state: AppState) => state.customizer);
  const menuState = useSelector((state: AppState) => state.menu);
  
  const isCollapsed = isSidebar 
    ? (menuState.isCollapse && !menuState.isSidebarHover)
    : menuState.isCollapse;

  return (
    <LinkStyled
      href="/"
      $collapse={isCollapsed}
      $topbarHeight={customizerState.TopbarHeight ?? 70}
      margin={margin}
    >
      <Box display="flex" alignItems="center" gap={0} width="100%" justifyContent={isCollapsed ? "center" : "flex-start"}>
        <Box
          component="img"
          src={logoTutor.src}
          alt="AILD Logo"
          sx={{ height: 50, width: 'auto', borderRadius: '8px', flexShrink: 0, objectFit: 'contain' }}
        />
        {!isCollapsed && (
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              color: '#1E3A8A',
              letterSpacing: '1px',
              fontFamily: '"Inter", "Outfit", sans-serif',
              ml: -2.5,
              whiteSpace: 'nowrap',
            }}
          >
            AILD
          </Typography>
        )}
      </Box>
    </LinkStyled>
  );
}