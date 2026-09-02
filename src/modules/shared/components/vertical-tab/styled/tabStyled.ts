import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/system';

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  // Add any additional styles here
  borderRight: `1px solid ${theme.palette.divider}`,
  height: '100%',
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    minWidth: 72,
    height: '100%',
    marginRight: theme.spacing(4),
    color: theme.palette.text.primary,
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  '& .MuiTab-wrapper': {
    justifyContent: 'flex-start',
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
  },
}));
