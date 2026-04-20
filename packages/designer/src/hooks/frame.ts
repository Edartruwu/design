"use client";

import { useCallback } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { setFrameSize, setSnap } from "../state/slices/settings.ts";
import type { FrameSize, SnapSettings } from "../types/frame.ts";

export function useFrameSize(): FrameSize {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.frame.frame);
}

export function useSetFrameSize(): (size: FrameSize) => void {
  const store = useDesignerStore();
  return useCallback(
    (size) => {
      commitImmediate(store.commitCtx, (draft) => setFrameSize(draft, size));
    },
    [store],
  );
}

export function useSnap(): SnapSettings {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.frame.snap);
}

export function useSetSnap(): (partial: Partial<SnapSettings>) => void {
  const store = useDesignerStore();
  return useCallback(
    (partial) => {
      commitImmediate(store.commitCtx, (draft) => setSnap(draft, partial));
    },
    [store],
  );
}
