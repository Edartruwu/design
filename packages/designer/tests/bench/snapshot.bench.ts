/**
 * Snapshot-rebuild benchmark.
 *
 * `buildLayerSnapshot()` is called on every useLayers() invalidation
 * (structural change). Budget: <4 ms at 1000 layers.
 */

import { bench, describe } from "vitest";
import { commitImmediate } from "../../src/state/actions/commit.ts";
import { createDesignerStore } from "../../src/state/core/createStore.ts";
import type { LayerShell } from "../../src/state/core/types.ts";
import { addLayer } from "../../src/state/slices/layers.ts";
import { buildLayerSnapshot } from "../../src/state/utils/snapshot.ts";
import { asLayerId } from "../../src/types/brand.ts";

function makeShell(id: string): LayerShell {
  return {
    id: asLayerId(id),
    name: id,
    type: "text",
    isLocked: false,
    isHidden: false,
    meta: {},
    cssVarKeys: ["--translate-x", "--translate-y", "--width", "--height"],
    version: 1,
  };
}

function prepared(count: number) {
  const store = createDesignerStore();
  commitImmediate(store.commitCtx, (draft) => {
    for (let i = 0; i < count; i++) {
      const id = `L-${i}`;
      addLayer(draft, makeShell(id));
      store.signals.hydrate(asLayerId(id), {
        "--translate-x": `${i}px`,
        "--translate-y": `${i}px`,
        "--width": "100px",
        "--height": "100px",
      });
    }
  });
  return store;
}

describe("useLayers snapshot", () => {
  for (const n of [100, 500, 1000, 2000]) {
    const store = prepared(n);
    bench(`buildLayerSnapshot @ ${n} layers`, () => {
      buildLayerSnapshot(store.getState(), store.signals);
    });
  }
});
