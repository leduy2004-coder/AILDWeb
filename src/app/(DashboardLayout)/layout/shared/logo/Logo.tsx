import { useSelector } from '@/store/hooks';
import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { AppState } from '@/store/store';
import Image from 'next/image';
import { Box } from '@mui/material';
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
    width: $collapse ? '40px' : '200px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: margin || 'auto',
    zIndex: 99999,
    textDecoration: 'none',
  }),
);

export default function Logo({ margin}: LogoProps) {
  const customizerState = useSelector((state: AppState) => state.customizer);
  const menuState = useSelector((state: AppState) => state.menu);

  return (
    <LinkStyled
      href="/"
      $collapse={menuState.isCollapse}
      $topbarHeight={customizerState.TopbarHeight ?? 70}
      margin={margin}
    >
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <Image
          src={logoTutor}
          alt="AILD Logo"
          width={60}
          height={60}
          style={{ borderRadius: '8px', flexShrink: 0 }}
        />
      </Box>
    </LinkStyled>
  );
}