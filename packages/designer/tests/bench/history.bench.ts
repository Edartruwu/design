/**
 * History apply benchmark.
 *
 * `applyUndo()` / `applyRedo()` should stay O(patches-in-group), not O(state
 * size). Budget: <5 ms for a group of 10 patches on a 1000-layer document.
 */

import { bench, describe } from "vitest";
import { commit, commitImmediate, flush } from "../../src/state/actions/commit.ts";
import { createDesignerStore } from "../../src/state/core/createStore.ts";
import type { LayerShell } from "../../src/state/core/types.ts";
import { applyUndo } from "../../src/state/slices/history.ts";
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

function prepared(layerCount: number, patchCount: number) {
  const store = createDesignerStore({ historyLimit: patchCount + 10 });
  commitImmediate(store.commitCtx, (draft) => {
    for (let i = 0; i < layerCount; i++) {
      addLayer(draft, makeShell(`L-${i}`));
    }
  });
  // Produce one giant PatchGroup with patchCount patches.
  const id = asLayerId("L-0");
  for (let i = 0; i < patchCount; i++) {
    commit(store.commitCtx, (d) => recordCssVarKeys(d, id, [`--mock-${i}`]), {
      key: "group",
    });
  }
  flush(store.commitCtx);
  return store;
}

describe("applyUndo", () => {
  for (const layerCount of [100, 1000]) {
    for (const patches of [10, 100]) {
      const store = prepared(layerCount, patches);
      bench(`undo @ ${layerCount} layers, ${patches} patches`, () => {
        applyUndo(store.getState());
      });
    }
  }
});
