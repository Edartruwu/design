"use client";

/**
 * `useLayers()` — returns the current `Layer[]` snapshot.
 *
 * Cached by `(order reference, byIdVersion)`. Signal ticks (cssVar changes
 * during drag) DO NOT invalidate this cache, so dragging a layer at 120 Hz
 * does not trigger useLayers-driven re-renders of Layer tree / panels.
 * Only structural changes (add / delete / reorder / rename / lock / hide /
 * type change) bump `byIdVersion` and cause a re-snapshot.
 *
 * On the commit that settles a gesture, the handful of `version` bumps on
 * touched shells produces one aggregated `byIdVersion` bump, so the panel
 * gets one re-render for the full gesture — which is what users expect.
 */

import { useMemo } from "react";
import type { Layer } from "../../types/layer.ts";
import { useDesignerStore } from "../core/context.tsx";
import { buildLayerSnapshot } from "../utils/snapshot.ts";
import { useStoreSlice } from "./useStoreSlice.ts";

interface SnapshotKey {
  readonly orderRef: readonly string[];
  readonly byIdVersion: number;
}

function pickKey(state: {
  layers: { order: readonly string[]; byIdVersion: number };
}): SnapshotKey {
  return { orderRef: state.layers.order, byIdVersion: state.layers.byIdVersion };
}

function keysEqual(a: SnapshotKey, b: SnapshotKey): boolean {
  return a.orderRef === b.orderRef && a.byIdVersion === b.byIdVersion;
}

export function useLayers(): readonly Layer[] {
  const store = useDesignerStore();
  const key = useStoreSlice(store, pickKey, keysEqual);
  // useMemo keyed on the same inputs. This is what actually returns a stable
  // Layer[] reference across frames during drag: key changes only on
  // structural bumps, not on cssVar ticks. We intentionally don't read `key`
  // inside the callback — its role is purely to bust the memo cache.
  // biome-ignore lint/correctness/useExhaustiveDependencies: key is a cache-invalidation token
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildLayerSnapshot(store.getState(), store.signals), [store, key]);
}
