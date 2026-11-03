import { useCallback, useEffect, useRef, useState } from 'react';

export type ViolationType = 'TAB_HIDDEN' | 'WINDOW_BLUR' | 'EXIT_FULLSCREEN';

interface UseAntiCheatOptions {
  enabled: boolean;
  // Admin setting; when off, fullscreen is neither required nor tracked
  requireFullscreen: boolean;
  // The server counts violations (survives reloads); this hook only detects them
  onViolation: (type: ViolationType) => void;
}

// A tab switch fires both blur and visibilitychange; report them as one violation
const VIOLATION_DEBOUNCE_MS = 1000;

const isFullscreenSupported = () =>
  typeof document !== 'undefined' && !!document.documentElement.requestFullscreen;

const isBlockedShortcut = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();
  const ctrl = e.ctrlKey || e.metaKey;
  if (key === 'f12') return true;
  // DevTools
  if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(key)) return true;
  // Copy / paste / cut / view source / save / print / select all
  if (ctrl && ['c', 'v', 'x', 'u', 's', 'p', 'a'].includes(key)) return true;
  return false;
};

export const useAntiCheat = ({ enabled, requireFullscreen, onViolation }: UseAntiCheatOptions) => {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document === 'undefined' || !isFullscreenSupported() || !!document.fullscreenElement
  );
  const lastViolationAtRef = useRef(0);
  const trackFullscreenRef = useRef(enabled && requireFullscreen);

  // Keep the latest callback without re-binding listeners
  const onViolationRef = useRef(onViolation);
  useEffect(() => {
    onViolationRef.current = onViolation;
    trackFullscreenRef.current = enabled && requireFullscreen;
  });

  const recordViolation = useCallback((type: ViolationType) => {
    const now = Date.now();
    if (now - lastViolationAtRef.current < VIOLATION_DEBOUNCE_MS) return;
    lastViolationAtRef.current = now;
    onViolationRef.current(type);
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (!isFullscreenSupported() || document.fullscreenElement) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Browser refused (no user gesture, iframe policy...): the overlay stays visible
    }
  }, []);

  // Track fullscreen even while disabled so the state is never stale
  useEffect(() => {
    if (!isFullscreenSupported()) return;
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active && trackFullscreenRef.current) recordViolation('EXIT_FULLSCREEN');
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [recordViolation]);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) recordViolation('TAB_HIDDEN');
    };
    const handleBlur = () => recordViolation('WINDOW_BLUR');
    const preventDefault = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBlockedShortcut(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // Browser shows its own "Leave site?" dialog; reloading/closing anyway is counted by the server on resume
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, recordViolation]);

  // Leave fullscreen once the test is over (result screen)
  useEffect(() => {
    if (enabled) return;
    if (typeof document !== 'undefined' && document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
    }
  }, [enabled]);

  return {
    // Content must stay hidden until the candidate is back in fullscreen
    needsFullscreen: enabled && requireFullscreen && !isFullscreen,
    enterFullscreen,
  };
};
