"use client";

/**
 * Typed CSS custom-property action for a selected layer.
 *
 * Consumer flow:
 * ```
 * const fontSize = createLayerCssVarAction("--font-size", "16px", {
 *   serialize: (n: number) => `${n}px`,
 *   deserialize: (raw) => Number.parseInt(raw ?? "16", 10),
 * });
 *
 * const [value, setValue] = useLayerCssVarAction(fontSize);
 * ```
 *
 * Contract:
 *  - `setValue` writes the serialized string to every SELECTED layer's signal
 *    and coalesces into a single history step via `commit(..., { key: action.key })`.
 *  - `value` reads from the FIRST selected layer's signal (mirrors the
 *    inspiration-doc semantics); if no layer is selected, returns the
 *    deserialized default.
 *
 * Commits fire on every setValue — the gesture lifecycle layer (Phase 3)
 * coalesces them under the `key` so a slider drag produces one history step.
 */

import { useCallback } from "react";
import { commit, flush } from "../state/actions/commit.ts";
import { useSignalValue } from "../state/bridges/useSignalValue.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { recordCssVarKeys } from "../state/slices/layers.ts";
import type { LayerCssVar } from "../types/css-vars.ts";

export interface LayerCssVarAction<TValue> {
  readonly var: LayerCssVar;
  readonly defaultValue: string;
  readonly key: string;
  readonly serialize: (value: TValue) => string;
  readonly deserialize: (raw: string | undefined) => TValue;
}

type Options<TValue> = {
  readonly serialize?: (value: TValue) => string;
  readonly deserialize?: (raw: string | undefined) => TValue;
  /** Optional coalescing key for commit batching (defaults to `cssvar:<varName>`). */
  readonly key?: string;
};

export function createLayerCssVarAction<TValue = string>(
  cssVar: LayerCssVar,
  defaultValue: string,
  options: Options<TValue> = {},
): LayerCssVarAction<TValue> {
  const serialize =
    options.serialize ??
    ((value: TValue) => (value as unknown as { toString(): string }).toString());
  const deserialize =
    options.deserialize ??
    ((raw: string | undefined) => (raw ?? defaultValue) as unknown as TValue);

  return {
    var: cssVar,
    defaultValue,
    key: options.key ?? `cssvar:${cssVar}`,
    serialize,
    deserialize,
  };
}

export function useLayerCssVarAction<TValue>(
  action: LayerCssVarAction<TValue>,
): readonly [TValue, (value: TValue) => void, { flush: () => void }] {
  const store = useDesignerStore();
  const selectedIds = useStoreSlice(
    store,
    (s) => s.selection.ids,
    (a, b) => a === b,
  );
  const firstId = selectedIds[0];
  // Subscribe to the first selected layer's signal; re-render when it changes.
  // When no layer is selected, we subscribe to a sentinel default signal.
  const sig = firstId ? store.signals.cssVar(firstId, action.var, action.defaultValue) : null;
  const rawValue = useSignalValue(
    sig ?? {
      get: () => action.defaultValue,
      peek: () => action.defaultValue,
      set: () => {},
      subscribe: () => () => {},
    },
  );
  const value = action.deserialize(rawValue as string);

  const setValue = useCallback(
    (next: TValue) => {
      if (selectedIds.length === 0) return;
      const serialized = action.serialize(next);
      // Write each selected layer's signal DIRECTLY (bypass React reconciler).
      for (const id of selectedIds) {
        store.signals.cssVar(id, action.var, action.defaultValue).set(serialized);
      }
      // Record the cssVar key on the shell and commit as a coalesced group.
      commit(
        store.commitCtx,
        (draft) => {
          for (const id of selectedIds) {
            recordCssVarKeys(draft, id, [action.var]);
          }
        },
        { key: action.key },
      );
    },
    [action, selectedIds, store],
  );

  const flushFn = useCallback(() => {
    flush(store.commitCtx);
  }, [store]);

  return [value, setValue, { flush: flushFn }] as const;
}
