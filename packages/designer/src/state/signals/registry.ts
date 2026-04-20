/**
 * Per-designer-instance registry of signals keyed by layer id + cssVar name.
 *
 * Design:
 *  - Signals live outside Zustand because they mutate at 120 Hz during drag;
 *    pushing those writes into Zustand would force a re-render of every
 *    subscriber to the layers slice on every frame.
 *  - Signals are created lazily on first read or write; unused vars never
 *    allocate a signal.
 *  - When a layer is deleted, its signals are kept weakly reachable so that
 *    undo can restore them with preserved identity. A `FinalizationRegistry`
 *    cleans up when the last strong reference disappears — this replaces the
 *    simpler tombstone map in v1 of the plan.
 *
 * The registry also tracks the `value` signal for each layer, used by text
 * layers where the raw content changes keystroke-by-keystroke and should
 * not force a Zustand commit per change.
 */

import type { LayerId } from "../../types/brand.ts";
import type { LayerCssVar } from "../../types/css-vars.ts";
import { createSignal, type Signal } from "./engine.ts";

type VarMap = Map<LayerCssVar, Signal<string>>;

export interface SignalRegistry {
  /** Get or create the signal for a layer's CSS custom property. */
  cssVar(id: LayerId, name: LayerCssVar, initial?: string): Signal<string>;
  /** Get or create the signal for a layer's raw `value` (e.g. text content). */
  value(id: LayerId, initial?: string): Signal<string>;
  /** Peek every currently-registered cssVar for a given layer. */
  snapshotCssVars(id: LayerId): Record<string, string>;
  /** Seed all cssVar signals for a layer at once. */
  hydrate(id: LayerId, cssVars: Record<string, string>, value?: string): void;
  /**
   * Mark a layer as deleted. Strong references are dropped; weak references
   * in tombstones survive while the history stack still references the
   * layer, and are GC'd once unreachable.
   */
  tombstone(id: LayerId): void;
  /**
   * Restore signals for a previously-tombstoned layer, if any are still in
   * memory. Returns true if tombstone was live, false if signals needed
   * to be recreated from scratch.
   */
  restore(id: LayerId): boolean;
  /** Number of layers with active signal state (debugging). */
  size(): number;
}

export function createSignalRegistry(): SignalRegistry {
  const live = new Map<LayerId, VarMap>();
  const liveValues = new Map<LayerId, Signal<string>>();

  // Tombstoned layers keep weak references so they can survive on the
  // history stack but get collected once truly unreachable.
  const tombVars = new Map<LayerId, WeakRef<VarMap>>();
  const tombValues = new Map<LayerId, WeakRef<Signal<string>>>();

  const finalizer = new FinalizationRegistry<LayerId>((id) => {
    // Only clear tombstone entries whose weakrefs are dead.
    const v = tombVars.get(id);
    if (v && !v.deref()) tombVars.delete(id);
    const s = tombValues.get(id);
    if (s && !s.deref()) tombValues.delete(id);
  });

  const getOrCreateMap = (id: LayerId): VarMap => {
    let map = live.get(id);
    if (!map) {
      map = new Map();
      live.set(id, map);
    }
    return map;
  };

  return {
    cssVar(id, name, initial = "") {
      const map = getOrCreateMap(id);
      let sig = map.get(name);
      if (!sig) {
        sig = createSignal(initial);
        map.set(name, sig);
      }
      return sig;
    },

    value(id, initial = "") {
      let sig = liveValues.get(id);
      if (!sig) {
        sig = createSignal(initial);
        liveValues.set(id, sig);
      }
      return sig;
    },

    snapshotCssVars(id) {
      const map = live.get(id);
      if (!map) return {};
      const out: Record<string, string> = {};
      for (const [name, sig] of map) {
        out[name] = sig.peek();
      }
      return out;
    },

    hydrate(id, cssVars, value) {
      const map = getOrCreateMap(id);
      for (const name in cssVars) {
        const val = cssVars[name] ?? "";
        let sig = map.get(name);
        if (!sig) {
          sig = createSignal(val);
          map.set(name, sig);
        } else {
          sig.set(val);
        }
      }
      if (value !== undefined) {
        let sig = liveValues.get(id);
        if (!sig) {
          sig = createSignal(value);
          liveValues.set(id, sig);
        } else {
          sig.set(value);
        }
      }
    },

    tombstone(id) {
      const map = live.get(id);
      if (map) {
        tombVars.set(id, new WeakRef(map));
        finalizer.register(map, id);
        live.delete(id);
      }
      const val = liveValues.get(id);
      if (val) {
        tombValues.set(id, new WeakRef(val));
        finalizer.register(val, id);
        liveValues.delete(id);
      }
    },

    restore(id) {
      let revived = false;
      const varRef = tombVars.get(id);
      const revivedMap = varRef?.deref();
      if (revivedMap) {
        live.set(id, revivedMap);
        tombVars.delete(id);
        revived = true;
      }
      const valRef = tombValues.get(id);
      const revivedVal = valRef?.deref();
      if (revivedVal) {
        liveValues.set(id, revivedVal);
        tombValues.delete(id);
        revived = true;
      }
      return revived;
    },

    size: () => live.size,
  };
}
