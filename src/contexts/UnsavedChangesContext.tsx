'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';

type UnsavedChangesContextType = {
  isDirty: boolean;
  setDirty: (value: boolean) => void;
  getIsDirty: () => boolean;

  message: string | null;
  setMessage: (value: string | null) => void;
  getMessage: () => string | null;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(
  null,
);

export function UnsavedChangesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDirty, _setDirty] = useState(false);
  const isDirtyRef = useRef(false);

  const [message, _setMessage] = useState<string | null>(null);
  const messageRef = useRef<string | null>(null);

  const setDirty = useCallback((value: boolean) => {
    isDirtyRef.current = value;
    _setDirty(value);
  }, []);

  const getIsDirty = useCallback(() => isDirtyRef.current, []);

  const setMessage = useCallback((value: string | null) => {
    messageRef.current = value;
    _setMessage(value);
  }, []);

  const getMessage = useCallback(() => messageRef.current, []);

  return (
    <UnsavedChangesContext.Provider
      value={{
        isDirty,
        setDirty,
        getIsDirty,
        message,
        setMessage,
        getMessage,
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    throw new Error(
      'useUnsavedChanges must be used within UnsavedChangesProvider',
    );
  }
  return ctx;
}
