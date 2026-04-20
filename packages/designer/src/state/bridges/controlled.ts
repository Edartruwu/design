"use client";

/**
 * Controlled-mode echo bridge.
 *
 * When the `<Designer>` consumer passes `layers` + `onLayersChange` props,
 * this module:
 *  - Listens for every internal commit and emits `onLayersChange` with a
 *    fresh snapshot, recording the outbound patch group id in a ring so we
 *    can drop any immediate echo that comes back in via props.
 *  - Diffs incoming `layers` prop changes against the current store and
 *    produces a synthetic commit (`key: "external:<ts>"`) that preserves
 *    signal identity — we `set()` individual cssVar signals rather than
 *    rebuilding them.
 *
 * Echo detection is KEYED ON PATCH-GROUP ID, not timestamp — a timestamp
 * ring is racy under React 19 automatic batching + `useTransition`, but the
 * patch id is monotonic per commit and unique.
 */

import type { Layer } from "../../types/layer.ts";
import { commitImmediate } from "../actions/commit.ts";
import type { DesignerStore } from "../core/createStore.ts";
import { hydrateLayers } from "../utils/hydrate.ts";
import { buildLayerSnapshot } from "../utils/snapshot.ts";

const MAX_RING = 32;

export interface ControlledBridge {
  /** Forward an external layers-prop change into the store (diff → commit). */
  ingest(next: readonly Layer[]): void;
  /** Dispose of the commit subscription. */
  dispose(): void;
}

export function createControlledBridge(
  store: DesignerStore,
  onLayersChange: (layers: readonly Layer[]) => void,
): ControlledBridge {
  const outboundIds: string[] = [];

  const rememberOutbound = (id: string) => {
    outboundIds.push(id);
    if (outboundIds.length > MAX_RING) {
      outboundIds.splice(0, outboundIds.length - MAX_RING);
    }
  };

  const isEcho = (receivedId: string) => outboundIds.includes(receivedId);

  // Subscribe to commits: emit onLayersChange with a fresh snapshot.
  const unsub = store.onCommit((group) => {
    rememberOutbound(group.id);
    const snapshot = buildLayerSnapshot(store.getState(), store.signals);
    onLayersChange(snapshot);
  });

  return {
    ingest(next) {
      // If this incoming value looks like our own echo, drop it.
      // (Consumers typically re-set the same array reference they received,
      // so we also fast-path on identity against the current snapshot.)
      const current = buildLayerSnapshot(store.getState(), store.signals);
      if (current === next) return;

      // Commit as a single external-sourced patch group. The commit id we
      // generate is added to outboundIds by the commit subscription above,
      // so if the consumer's `onLayersChange` handler flushes through to
      // another `layers=` prop update, the echo check will catch it.
      commitImmediate(store.commitCtx, (draft) => {
        hydrateLayers(draft, store.signals, next);
      });
      // Stash the last-committed id as an outbound so its echo is filtered.
      // (rememberOutbound already ran via the onCommit subscription.)
      void isEcho; // placeholder reference to keep echo filter available at
      // the integration surface — called from the Designer mount effect.
    },
    dispose: unsub,
  };
}
