import classNames from 'classnames';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

import { ExtendableComponentProps } from '@/types/shared';

type SkeletonShadowProps = ExtendableComponentProps<
  'div',
  {
    isLoading?: boolean;
  }
>;

type SkeletonLoadingProps = ExtendableComponentProps<
  'div',
  {
    isLoading?: boolean;
  }
> &
  SkeletonProps;

function SkeletonShadow({
  className,
  isLoading,
  children,
  ...props
}: SkeletonShadowProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <div
      className={classNames(
        'animate-pulse rounded-md bg-primary/10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function SkeletonLoading({
  isLoading,
  count = 1,
  children,
  ...props
}: SkeletonLoadingProps) {
  if (!isLoading) return <>{children}</>;

  return (
    <Skeleton
      count={count}
      baseColor={'#E9EBED'}
      highlightColor={'#D2D6DA'}
      height={'25px'}
      width={'70%'}
      {...props}
    />
  );
}

export { SkeletonLoading, SkeletonShadow };
