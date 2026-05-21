import { useState, useCallback } from 'react';
import type { AppState } from '../types';

const MAX_HISTORY = 50;

export function useHistory(initialState: AppState) {
  const [past, setPast] = useState<AppState[]>([]);
  const [future, setFuture] = useState<AppState[]>([]);
  const [current, setCurrent] = useState<AppState>(initialState);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const push = useCallback((state: AppState) => {
    setPast(p => [...p.slice(-MAX_HISTORY + 1), state]);
    setFuture([]);
    setCurrent(state);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    setPast(p => p.slice(0, -1));
    setFuture(f => [...f, current]);
    setCurrent(previous);
    return previous;
  }, [past, current]);

  const redo = useCallback(() => {
    if (future.length === 0) return null;
    const next = future[future.length - 1];
    setFuture(f => f.slice(0, -1));
    setPast(p => [...p, current]);
    setCurrent(next);
    return next;
  }, [future, current]);

  return { canUndo, canRedo, push, undo, redo };
}
