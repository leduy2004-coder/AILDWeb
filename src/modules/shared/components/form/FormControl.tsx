'use client';

import { FormControlLabel } from '@/modules/shared/components/form/FormControlLabel';
import { Grid, GridProps } from '@mui/material';

type FormControlProps = {
  children: React.ReactNode;
  required?: boolean;
  label?: string;
  name?: string;
  labelStyle?: React.CSSProperties;
} & GridProps;

export function FormControl({
  children,
  required,
  label,
  name,
  labelStyle,
  ...props
}: FormControlProps) {
  return (
    <Grid container {...props}>
      <Grid size={12} display="flex" alignItems="center">
        {label && (
          <FormControlLabel
            htmlFor={name}
            sx={{ mt: 0, minHeight: '29px', ...labelStyle }}
          >
            {label} {required && <span className="text-error">*</span>}
          </FormControlLabel>
        )}
      </Grid>

      <Grid size={{ xs: 12 }}>
        {children}
      </Grid>
    </Grid>
  );
}
