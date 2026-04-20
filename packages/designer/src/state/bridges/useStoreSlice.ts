"use client";

/**
 * React bridge for Zustand-style slice reads.
 *
 * We use `useSyncExternalStoreWithSelector` from the React-team-maintained
 * shim rather than the stock `useSyncExternalStore` because:
 *  - It gives us a selector + custom equality in one call — otherwise we'd
 *    reimplement selector memoization at every consumer.
 *  - The shim correctly handles React 19 concurrent-mode / Activity edge
 *    cases where the stock hook has known bugs
 *    (facebook/react#27670).
 *  - It's what Redux Toolkit and Zustand use internally — battle-tested.
 */

// The subpath import is a CommonJS-default .js export that some bundlers
// (including rolldown/tsdown) complain about when resolving types. We use
// the named re-export shape explicitly.
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector.js";
import type { DesignerStore } from "../core/createStore.ts";
import type { DesignerState } from "../core/types.ts";

export function useStoreSlice<U>(
  store: DesignerStore,
  selector: (state: DesignerState) => U,
  isEqual: (a: U, b: U) => boolean = Object.is,
): U {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getState, // getServerSnapshot — same as client (state is SSR-safe shape)
    selector,
    isEqual,
  );
}
