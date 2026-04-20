"use client";

import { useCallback } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { setDebug } from "../state/slices/settings.ts";

export function useDebug(): boolean {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.debug.debug);
}

export function useSetDebug(): (on: boolean) => void {
  const store = useDesignerStore();
  return useCallback(
    (on) => {
      commitImmediate(store.commitCtx, (draft) => setDebug(draft, on));
    },
    [store],
  );
}
