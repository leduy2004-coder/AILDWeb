import { ReactNode } from 'react';

import { TabsOwnProps } from '@mui/material/Tabs';
import { StyledTabs } from './styled';

type VerticalTabsProps = { children: ReactNode } & TabsOwnProps;

export function VerticalTabs({ value, onChange, children }: VerticalTabsProps) {
  return (
    <StyledTabs
      orientation="vertical"
      variant="scrollable"
      value={value}
      aria-label="Vertical tabs example"
      sx={{ borderRight: 1, borderColor: 'divider' }}
      onChange={onChange}
    >
      {children}
    </StyledTabs>
  );
}
