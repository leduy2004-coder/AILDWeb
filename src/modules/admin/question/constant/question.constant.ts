import { ChipProps } from '@mui/material';

export const QUESTION_STATUS_COLOR: Record<string, ChipProps['color']> = {
  PUBLISHED: 'success',
  DRAFT: 'default',
  REJECTED: 'error',
};

export const QUESTION_DOMAIN_COLOR: Record<number, ChipProps['color']> = {
  1: 'primary',
  2: 'info',
  3: 'secondary',
  4: 'success',
};
