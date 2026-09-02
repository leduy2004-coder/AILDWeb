import { useSelector } from '@/store/hooks';
import { AppState } from '@/store/store';
import { AnyType } from '@/types/shared';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
  sx?: AnyType;
};

const BlankCard = ({ children, className, sx }: Props) => {
  const customizer = useSelector((state: AppState) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{
        p: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none',
        position: 'relative',
        sx,
      }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      {children}
    </Card>
  );
};

export default BlankCard;
