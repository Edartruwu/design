/**
 * Designer store factory. One store per `<Designer>` instance; multiple
 * designers on the same page do not share state.
 *
 * The store is a minimal `useSyncExternalStore`-compatible subscriber
 * (getState / setState / subscribe) rather than a full Zustand instance.
 * We chose this because:
 *  - Every mutation goes through `commit()` which already produces patches;
 *    running Zustand's middleware stack on top would double-wrap the work.
 *  - It makes the bridge layer (`useStoreSlice.ts`) trivially simple:
 *    `useSyncExternalStoreWithSelector` is a perfect fit for this shape.
 *  - It avoids a couple of React 19 concurrent-mode caveats around
 *    Zustand v5's getServerSnapshot semantics.
 *
 * If we later need Zustand's devtools or persist middleware, we can swap
 * this implementation without changing any consumer code — all hook
 * consumers only see the opaque `DesignerStore` interface below.
 */

import type { CommitContext } from "../actions/commit.ts";
import { createSignal, type Signal } from "../signals/engine.ts";
import { createInteractionSignal, type InteractionSignal } from "../signals/interaction.ts";
import { createSignalRegistry, type SignalRegistry } from "../signals/registry.ts";
import { initialState } from "../slices/initial.ts";
import type { DesignerState, PatchGroup } from "./types.ts";

export type Listener = () => void;
export type Unsubscribe = () => void;

export interface DesignerStore {
  getState(): DesignerState;
  /** Subscribe to ANY state change; listener is called after setState commits. */
  subscribe(listener: Listener): Unsubscribe;
  /**
   * Internal mutation facade. Not exposed to consumers. Hooks and controllers
   * call this through `commit()` / `flush()` helpers.
   */
  readonly commitCtx: CommitContext<DesignerState>;
  readonly signals: SignalRegistry;
  readonly interaction: InteractionSignal;
  /**
   * Interaction targets (DOM elements). These are imperative, non-serializable
   * references so they live outside the Zustand state (which must be
   * serializable for history / persistence).
   */
  readonly targets: Signal<readonly HTMLElement[]>;
  /**
   * Called whenever pending group is flushed and pushed onto history. Used
   * by the controlled-mode bridge to emit `onLayersChange`.
   */
  onCommit(listener: (group: PatchGroup) => void): Unsubscribe;
}

export interface CreateStoreOptions {
  readonly initial?: DesignerState;
  readonly historyLimit?: number;
}

export function createDesignerStore(options: CreateStoreOptions = {}): DesignerStore {
  const historyLimit = options.historyLimit ?? 200;

  let state: DesignerState = options.initial ?? initialState;
  const listeners = new Set<Listener>();
  const commitListeners = new Set<(group: PatchGroup) => void>();
  const pending: { current: PatchGroup | null } = { current: null };

  const signals = createSignalRegistry();
  const interaction = createInteractionSignal();
  const targets = createSignal<readonly HTMLElement[]>([]);

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const commitCtx: CommitContext<DesignerState> = {
    getState: () => state,
    setState: (next) => {
      state = next;
      notify();
    },
    pushHistory: (group) => {
      const past = state.history.past;
      const capped = past.length >= historyLimit ? past.slice(1) : past;
      state = {
        ...state,
        history: {
          ...state.history,
          past: [...capped, group],
          future: [], // any commit clears redo
        },
      };
      for (const listener of commitListeners) listener(group);
      notify();
    },
    pending,
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    onCommit(listener) {
      commitListeners.add(listener);
      return () => {
        commitListeners.delete(listener);
      };
    },
    commitCtx,
    signals,
    interaction,
    targets,
  };
}
