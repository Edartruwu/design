"use client";

import { useCallback } from "react";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { applyRedo, applyUndo } from "../state/slices/history.ts";

export function useUndo(): () => void {
  const store = useDesignerStore();
  return useCallback(() => {
    const next = applyUndo(store.getState());
    if (next) store.commitCtx.setState(next);
  }, [store]);
}

export function useRedo(): () => void {
  const store = useDesignerStore();
  return useCallback(() => {
    const next = applyRedo(store.getState());
    if (next) store.commitCtx.setState(next);
  }, [store]);
}

export function useCanUndo(): boolean {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.history.past.length > 0);
}

export function useCanRedo(): boolean {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.history.future.length > 0);
}

export interface HistoryView {
  readonly pastLength: number;
  readonly futureLength: number;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
}

export function useHistory(): HistoryView {
  const store = useDesignerStore();
  return useStoreSlice(
    store,
    (s) => ({
      pastLength: s.history.past.length,
      futureLength: s.history.future.length,
      canUndo: s.history.past.length > 0,
      canRedo: s.history.future.length > 0,
    }),
    (a, b) =>
      a.pastLength === b.pastLength &&
      a.futureLength === b.futureLength &&
      a.canUndo === b.canUndo &&
      a.canRedo === b.canRedo,
  );
}
