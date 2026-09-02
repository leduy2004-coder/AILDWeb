import * as React from 'react';
import {
  NiceModalHandler,
  NiceModalHocProps,
  useModal,
} from '@ebay/nice-modal-react';
import { useCallbackRef } from './useCallbackRef';

type Show<T> = (this: void, props?: T) => Promise<void>;

export type UseAppModalReturnType<T> = Pick<NiceModalHandler, 'visible'> & {
  show: Show<T>;
  remove(this: void): void;
};

export function useAppModal<Props>(
  Component: React.FC<Props & NiceModalHocProps>,
): UseAppModalReturnType<Props> {
  const modal = useModal(Component);
  const refShow = useCallbackRef(modal.show);
  const refRemove = useCallbackRef(modal.remove);

  const show = React.useCallback(
    async (props?: Props) => {
      await refShow.current((props ?? {}) as never);
    },
    [refShow],
  );

  const remove = React.useCallback(() => {
    refRemove.current();
  }, [refRemove]);

  return React.useMemo<UseAppModalReturnType<Props>>(
    () => ({
      visible: modal.visible,
      show,
      remove,
    }),
    [modal.visible, show, remove],
  );
}
