"use client";

import { useCallback } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { setDpi, setUnit } from "../state/slices/settings.ts";
import type { Unit } from "../types/unit.ts";

export function useUnitSystem(): Unit {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.units.unit);
}

export function useSetUnitSystem(): (unit: Unit) => void {
  const store = useDesignerStore();
  return useCallback(
    (unit) => {
      commitImmediate(store.commitCtx, (draft) => setUnit(draft, unit));
    },
    [store],
  );
}

export function useDPI(): number {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.units.dpi);
}

export function useSetDPI(): (dpi: number) => void {
  const store = useDesignerStore();
  return useCallback(
    (dpi) => {
      commitImmediate(store.commitCtx, (draft) => setDpi(draft, dpi));
    },
    [store],
  );
}
