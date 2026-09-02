import { useEffect, useRef } from 'react';

/**
 * Custom hook to warn users when they try to refresh/close the page with unsaved changes.
 * Shows the browser's native confirmation dialog.
 *
 * @param hasUnsavedChanges - Function that returns true if there are unsaved changes
 * @param enabled - Whether the warning should be active (default: true)
 */
let skipBeforeUnload = false;

export const disableUnsavedWarning = () => {
  skipBeforeUnload = true;
};

export const useUnsavedChangesWarning = (
  hasUnsavedChanges: () => boolean,
  enabled: boolean = true,
) => {
  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);

  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (skipBeforeUnload) return;

      if (hasUnsavedChangesRef.current()) {
        e.preventDefault();
        e.returnValue = '';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled]);
};

