import { Theme } from '@mui/material/styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = unknown | any;
export type EmptyObject = Record<PropertyKey, never>;

export interface BaseTheme extends Theme {
  unstable_strictMode?: boolean;
}
