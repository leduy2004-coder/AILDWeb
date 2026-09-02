import * as React from 'react';

export function useCallbackRef<
  C extends ((...params: never[]) => unknown) | undefined,
>(callback: C): React.MutableRefObject<C> {
  const callbackRef = React.useRef<C>(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return callbackRef;
}
