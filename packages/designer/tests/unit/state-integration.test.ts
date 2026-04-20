/**
 * End-to-end integration test for the Phase 1b state engine.
 *
 * Verifies the architectural thesis:
 *  - `commit()` produces Mutative forward + inverse patches.
 *  - Commits sharing a `groupKey` coalesce into one PatchGroup.
 *  - `flush()` seals the pending group and pushes to history.
 *  - `applyUndo()` / `applyRedo()` round-trip correctly.
 *  - Signals mutate without touching the Zustand state shape.
 *  - WeakRef tombstoning allows deleted layers' signals to survive GC
 *    while history still references them.
 */

import { describe, expect, test } from "vitest";
import { commit, commitImmediate, flush } from "../../src/state/actions/commit.ts";
import { createDesignerStore } from "../../src/state/core/createStore.ts";
import type { LayerShell } from "../../src/state/core/types.ts";
import { applyRedo, applyUndo } from "../../src/state/slices/history.ts";
import { addLayer, deleteLayer, setLayerProperty } from "../../src/state/slices/layers.ts";
import { setZoom } from "../../src/state/slices/settings.ts";
import { asLayerId } from "../../src/types/brand.ts";

function makeShell(id: string, name = `L-${id}`): LayerShell {
  return {
    id: asLayerId(id),
    name,
    type: "text",
    isLocked: false,
    isHidden: false,
    meta: {},
    cssVarKeys: [],
    version: 1,
  };
}

describe("commit + history", () => {
  test("commitImmediate pushes one patch group per call", () => {
    const store = createDesignerStore();

    commitImmediate(store.commitCtx, (d) => {
      setZoom(d, 2);
    });

    expect(store.getState().zoom.zoom).toBe(2);
    expect(store.getState().history.past).toHaveLength(1);
    expect(store.getState().history.future).toHaveLength(0);
  });

  test("commits sharing a groupKey coalesce; flush seals the group", () => {
    const store = createDesignerStore();

    // Simulate a drag: three coalescing writes + one flush.
    for (const z of [1.1, 1.2, 1.3]) {
      commit(store.commitCtx, (d) => setZoom(d, z), { key: "drag" });
    }
    // Still pending, not in past yet.
    expect(store.getState().history.past).toHaveLength(0);
    expect(store.commitCtx.pending.current).not.toBeNull();

    flush(store.commitCtx);

    expect(store.getState().zoom.zoom).toBeCloseTo(1.3);
    expect(store.getState().history.past).toHaveLength(1);
    expect(store.commitCtx.pending.current).toBeNull();

    // One group contains all 3 patches, but undo unwinds to the PRE-gesture value.
    let next = applyUndo(store.getState());
    expect(next).not.toBeNull();
    expect(next!.zoom.zoom).toBe(1); // initial default
    expect(next!.history.past).toHaveLength(0);
    expect(next!.history.future).toHaveLength(1);

    // Redo restores the final drag value.
    next = applyRedo(next!);
    expect(next).not.toBeNull();
    expect(next!.zoom.zoom).toBeCloseTo(1.3);
  });

  test("commits with different groupKeys create distinct history entries", () => {
    const store = createDesignerStore();

    commit(store.commitCtx, (d) => setZoom(d, 1.5), { key: "a" });
    // Different key → seals the previous group and opens a new one.
    commit(store.commitCtx, (d) => setZoom(d, 1.8), { key: "b" });
    flush(store.commitCtx);

    expect(store.getState().history.past).toHaveLength(2);
  });

  test("add, update, delete layer + undo flow", () => {
    const store = createDesignerStore();
    const a = asLayerId("a");

    // Add
    commitImmediate(store.commitCtx, (d) => addLayer(d, makeShell("a")));
    expect(store.getState().layers.order).toEqual([a]);

    // Rename
    commitImmediate(store.commitCtx, (d) => setLayerProperty(d, a, "name", "Renamed"));
    expect(store.getState().layers.layersById[a]?.name).toBe("Renamed");

    // Delete
    commitImmediate(store.commitCtx, (d) => deleteLayer(d, a));
    expect(store.getState().layers.order).toEqual([]);
    expect(store.getState().history.past).toHaveLength(3);

    // Undo delete → layer reappears with renamed state
    let s = applyUndo(store.getState())!;
    expect(s.layers.order).toEqual([a]);
    expect(s.layers.layersById[a]?.name).toBe("Renamed");

    // Undo rename → back to original name
    s = applyUndo(s)!;
    expect(s.layers.layersById[a]?.name).toBe("L-a");

    // Undo add → layer gone again
    s = applyUndo(s)!;
    expect(s.layers.order).toEqual([]);
  });

  test("history cap evicts oldest groups", () => {
    const store = createDesignerStore({ historyLimit: 3 });

    for (const z of [1.1, 1.2, 1.3, 1.4, 1.5]) {
      commitImmediate(store.commitCtx, (d) => setZoom(d, z));
    }

    // Only the last 3 should remain.
    expect(store.getState().history.past).toHaveLength(3);
    // Applying every remaining undo brings us to zoom==1.2 (not 1.0),
    // because the original commit was evicted.
    let s = store.getState();
    for (let i = 0; i < 3; i++) {
      s = applyUndo(s)!;
    }
    expect(s.zoom.zoom).toBeCloseTo(1.2);
  });
});

describe("signals registry", () => {
  test("signals survive a delete → undo cycle via WeakRef tombstone", () => {
    const store = createDesignerStore();
    const id = asLayerId("a");

    // Create layer and a live cssVar signal bound to it.
    commitImmediate(store.commitCtx, (d) => addLayer(d, makeShell("a")));
    const sig = store.signals.cssVar(id, "--width", "100px");
    expect(sig.peek()).toBe("100px");

    // "Delete" the layer: tombstone its signals, remove shell.
    store.signals.tombstone(id);
    commitImmediate(store.commitCtx, (d) => deleteLayer(d, id));

    // Undo the delete — restore signals from the (still-live) WeakRef.
    const revived = store.signals.restore(id);
    expect(revived).toBe(true);

    // The revived signal is the same object identity, so any prior subscribers
    // are still wired up.
    const sig2 = store.signals.cssVar(id, "--width");
    expect(sig2).toBe(sig);
    expect(sig2.peek()).toBe("100px");
  });

  test("signal subscribers do not fire before a change", () => {
    const store = createDesignerStore();
    const id = asLayerId("a");
    const sig = store.signals.cssVar(id, "--width", "100px");

    let fired = 0;
    let lastValue = "";
    const unsub = sig.subscribe((v) => {
      fired++;
      lastValue = v;
    });

    // Setting to the same value: no notification.
    sig.set("100px");
    expect(fired).toBe(0);

    sig.set("250px");
    expect(fired).toBe(1);
    expect(lastValue).toBe("250px");

    sig.set("250px");
    expect(fired).toBe(1);

    unsub();
    sig.set("999px");
    expect(fired).toBe(1);
  });
});
