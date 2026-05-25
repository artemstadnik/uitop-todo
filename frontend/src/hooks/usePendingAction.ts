import { useCallback, useRef, useState } from 'react';

interface PendingAction {
  message: string;       
  onCommit: () => void;  
  onUndo: () => void;    
}

const UNDO_TIMEOUT_MS = 5000;

export function usePendingAction() {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const pendingRef = useRef<PendingAction | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedule = useCallback((action: PendingAction) => {
    clearTimer();

    const prev = pendingRef.current;
    if (prev) prev.onCommit();

    pendingRef.current = action;
    setPending(action);

    timerRef.current = setTimeout(() => {
      const current = pendingRef.current;
      pendingRef.current = null;
      timerRef.current = null;
      setPending(null);
      current?.onCommit();
    }, UNDO_TIMEOUT_MS);
  }, []);

  const undo = useCallback(() => {
    clearTimer();
    const current = pendingRef.current;
    pendingRef.current = null;
    setPending(null);
    current?.onUndo();
  }, []);

  const dismiss = useCallback(() => {
    setPending(null);
  }, []);

  return { pending, schedule, undo, dismiss, undoTimeoutMs: UNDO_TIMEOUT_MS };
}
