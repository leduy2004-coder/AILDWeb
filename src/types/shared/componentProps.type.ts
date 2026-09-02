import { ComponentPropsWithRef, ElementType } from 'react';

type EmptyObjectType = Record<string, unknown>;
type KeyOfEmptyType<T extends EmptyObjectType = EmptyObjectType> =
  keyof T extends never ? '' : keyof T;

export type ExtendableComponentProps<
  T extends ElementType,
  P extends EmptyObjectType = EmptyObjectType,
> = P & Omit<ComponentPropsWithRef<T>, KeyOfEmptyType<P>>;
export type OverridableComponentProps<
  T extends ElementType,
  P extends EmptyObjectType = EmptyObjectType,
> = {
  component?: T;
} & ExtendableComponentProps<T, P>;
