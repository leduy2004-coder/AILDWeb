import { useSelector } from '@/store/hooks';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { AppState } from '@/store/store';
import Image from 'next/image';
import { Box, Typography } from '@mui/material';
// logo.png with its transparent padding trimmed, so the mark sits right next to the "AILD" text
import logoMark from '@/assests/images/logo-mark.png';

interface LogoProps {
  margin?: string;
  isSidebar?: boolean;
  // Public pages link straight to /home: "/" mounts the dashboard layout before redirecting
  href?: string;
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
  ({ theme, $collapse, $topbarHeight, margin }) => ({
    height: $collapse ? '50px' : $topbarHeight,
    [theme.breakpoints.down('md')]: {
      height: '40px',
      width: $collapse ? '100%' : 'auto',
    },
    width: $collapse ? '100%' : '200px',
    // Keep full size in a crowded header (mobile), otherwise overflow hidden clips the logo
    flexShrink: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: $collapse ? 'center' : 'flex-start',
    margin: margin || 'auto',
    zIndex: 99999,
    textDecoration: 'none',
  }),
);

export default function Logo({ margin, isSidebar, href = '/' }: LogoProps) {
  const customizerState = useSelector((state: AppState) => state.customizer);
  const menuState = useSelector((state: AppState) => state.menu);
  
  const isCollapsed = isSidebar 
    ? (menuState.isCollapse && !menuState.isSidebarHover)
    : menuState.isCollapse;

  return (
    <LinkStyled
      href={href}
      $collapse={isCollapsed}
      $topbarHeight={customizerState.TopbarHeight ?? 70}
      margin={margin}
    >
      <Box display="flex" alignItems="center" gap={1} width="100%" justifyContent={isCollapsed ? "center" : "flex-start"}>
        <Box
          component="img"
          src={logoMark.src}
          alt="AILD Logo"
          sx={{ height: { xs: 30, md: 40 }, width: 'auto', flexShrink: 0, objectFit: 'contain' }}
        />
        {!isCollapsed && (
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              color: '#1E3A8A',
              letterSpacing: '1px',
              fontFamily: '"Inter", "Outfit", sans-serif',
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