/**
 * Hot-path drag benchmark.
 *
 * Simulates a 240 Hz pointer stream writing to a cssVar signal. The
 * architectural invariant is: signal.set → DOM is <1 ms end-to-end,
 * and NO Zustand commit happens during the drag (only at flush).
 *
 * Run with: `bun run test:bench` (or `bunx vitest bench --run`).
 */

import { bench, describe } from "vitest";
import { commit, flush } from "../../src/state/actions/commit.ts";
import { createDesignerStore } from "../../src/state/core/createStore.ts";
import type { LayerShell } from "../../src/state/core/types.ts";
import { addLayer, recordCssVarKeys } from "../../src/state/slices/layers.ts";
import { asLayerId } from "../../src/types/brand.ts";

function makeShell(id: string): LayerShell {
  return {
    id: asLayerId(id),
    name: id,
    type: "text",
    isLocked: false,
    isHidden: false,
    meta: {},
    cssVarKeys: [],
    version: 1,
  };
}

describe("drag hot path", () => {
  bench(
    "1000 signal writes (pure registry)",
    () => {
      const store = createDesignerStore();
      const id = asLayerId("L-1");
      const sig = store.signals.cssVar(id, "--translate-x", "0px");
      for (let i = 0; i < 1000; i++) {
        sig.set(`${i}px`);
      }
    },
    { time: 500 },
  );

  bench(
    "1000 coalesced commits + flush (drag lifecycle)",
    () => {
      const store = createDesignerStore();
      const id = asLayerId("L-1");
      // Seed the layer once.
      commit(store.commitCtx, (d) => addLayer(d, makeShell("L-1")));
      flush(store.commitCtx);
      // Drag: 1000 coalescing commits under one key.
      for (let i = 0; i < 1000; i++) {
        commit(store.commitCtx, (d) => recordCssVarKeys(d, id, [`--mock-${i}`]), { key: "drag" });
      }
      flush(store.commitCtx);
    },
    { time: 500 },
  );

  bench(
    "1000 signal writes WITH a subscriber (simulates 1 layer rendered)",
    () => {
      const store = createDesignerStore();
      const id = asLayerId("L-1");
      const sig = store.signals.cssVar(id, "--translate-x", "0px");
      let received = 0;
      const unsub = sig.subscribe(() => {
        received++;
      });
      for (let i = 0; i < 1000; i++) {
        sig.set(`${i}px`);
      }
      unsub();
      if (received !== 1000) {
        throw new Error(`expected 1000 notifications, got ${received}`);
      }
    },
    { time: 500 },
  );
});
