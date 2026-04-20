"use client";

import { useCallback, useEffect, useMemo } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { setKeybinding } from "../state/slices/settings.ts";
import type { Keybinding } from "../types/keybinding.ts";

export function useKeybindings(): Readonly<Record<string, Keybinding>> {
  const store = useDesignerStore();
  const bindings = useStoreSlice(store, (s) => s.keybindings.bindings);
  const overrides = useStoreSlice(store, (s) => s.keybindings.overrides);
  return useMemo(() => ({ ...bindings, ...overrides }), [bindings, overrides]);
}

export function useSetKeybindings(): (next: Record<string, Keybinding | null>) => void {
  const store = useDesignerStore();
  return useCallback(
    (next) => {
      commitImmediate(store.commitCtx, (draft) => {
        for (const [name, binding] of Object.entries(next)) {
          setKeybinding(draft, name, binding);
        }
      });
    },
    [store],
  );
}

/**
 * Subscribe to a named shortcut. The actual key-dispatch loop is installed
 * in the canvas package (Phase 3); this hook merely registers a handler
 * in a simple listener map on the store.
 *
 * For now (pre-canvas), it just validates the binding name exists and is a
 * no-op. The handler is wired up in Phase 3's `KeyboardController.ts`.
 */
export function useShortcut(name: string, handler: () => void): void {
  const bindings = useKeybindings();
  useEffect(() => {
    const binding = bindings[name];
    if (!binding) return;
    // Phase 3 wires this to the actual keyboard controller.
    // Left intentionally inert here to keep the state package self-contained.
    void handler;
    return undefined;
  }, [bindings, name, handler]);
}
