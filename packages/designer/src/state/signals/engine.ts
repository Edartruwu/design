/**
 * Thin, idiomatic wrapper over `alien-signals` that exposes a
 * `.get / .set / .peek / .subscribe` surface matching the rest of the
 * codebase.
 *
 * We wrap the callable `signal(initial)` so that:
 *  - `.peek()` reads without tracking (needed by `useLayers()` snapshots).
 *  - `.subscribe(cb)` runs `cb(nextValue)` only when the signal's value
 *    actually changes (skipping the effect's initial "collect dependencies"
 *    invocation). This matches the contract expected by
 *    `useSyncExternalStore` and by the DOM bridge in `<DesignerLayer>`.
 *
 * Alien-signals is chosen over `@preact/signals-react` because it has no
 * React-concurrent-mode caveats, is ~1 kB, and is faster. It's intentionally
 * NOT a React binding — reactivity-to-React happens via
 * `useSyncExternalStoreWithSelector` at the bridge layer.
 */

import { effect as alienEffect, signal as alienSignal, setCurrentSub } from "alien-signals";

export interface Signal<T> {
  /** Read the current value and register a dependency when called inside an effect. */
  get(): T;
  /** Read without registering a dependency. */
  peek(): T;
  /** Overwrite the value. No-op if `Object.is(prev, next)`. */
  set(value: T): void;
  /**
   * Subscribe to value changes. Callback receives the NEW value on every
   * real change (not on initial subscription). Returns an unsubscribe fn.
   */
  subscribe(callback: (value: T) => void): Unsubscribe;
}

export type Unsubscribe = () => void;

export function createSignal<T>(initialValue: T): Signal<T> {
  const inner = alienSignal<T>(initialValue);

  const peek = (): T => {
    // Temporarily detach the current subscriber so this read creates no edge.
    const prev = setCurrentSub(undefined);
    try {
      return inner();
    } finally {
      setCurrentSub(prev);
    }
  };

  return {
    get: () => inner(),
    peek,
    set: (value) => {
      if (Object.is(peek(), value)) return;
      inner(value);
    },
    subscribe(callback) {
      let initialized = false;
      let previous: T;
      return alienEffect(() => {
        const next = inner();
        if (!initialized) {
          previous = next;
          initialized = true;
          return;
        }
        if (!Object.is(previous, next)) {
          previous = next;
          callback(next);
        }
      });
    },
  };
}

/**
 * Barebones subscribe that only fires an onChange notification (no value).
 * Cheaper than `.subscribe` for `useSyncExternalStore`, where the hook will
 * read the current value itself via `getSnapshot`.
 */
export function watch<T>(sig: Signal<T>, onChange: () => void): Unsubscribe {
  let initialized = false;
  return alienEffect(() => {
    sig.get();
    if (!initialized) {
      initialized = true;
      return;
    }
    onChange();
  });
}

/**
 * Batch multiple signal writes so downstream effects run once. Mirrors
 * alien-signals' `startBatch` / `endBatch` but with a scoped helper.
 */
export { endBatch, startBatch } from "alien-signals";
