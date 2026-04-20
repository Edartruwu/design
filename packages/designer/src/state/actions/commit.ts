/**
 * `commit()` — the single chokepoint for every document mutation.
 *
 * Architectural thesis:
 *  - Every commit uses Mutative's `create(..., { enablePatches: true })` to
 *    produce forward+inverse patches (RFC 6902 JSON Patch native). This is
 *    ~175× faster than Immer's equivalent path on the workloads that matter
 *    (many small mutations per gesture) and patches are structurally minimal
 *    so history cost per step is bytes, not kilobytes.
 *  - Commits sharing the same `groupKey` coalesce into one `PatchGroup`.
 *    A gesture calls `commit(..., { key: "drag:<gestureId>" })` many times
 *    during the RAF loop and exactly one `flush()` at pointerup — consumers
 *    see one history entry per gesture.
 *  - `enableAutoFreeze: false` is critical: auto-freeze is the single biggest
 *    Mutative perf killer on this workload. We rely on our own immutability
 *    discipline + TypeScript readonly markers instead.
 */

import { create, type Draft, type Patches } from "mutative";
import type { PatchGroup } from "../core/types.ts";

let _nonce = 0;
/** Unique, monotonically-increasing id for a patch group. */
export function nextPatchGroupId(): string {
  return `g_${Date.now().toString(36)}_${(_nonce++).toString(36)}`;
}

/**
 * Context object passed to every `commit` call. Wires the store facade
 * (get/set state, push to history) without coupling `commit` to Zustand.
 */
export interface CommitContext<S> {
  getState(): S;
  setState(next: S): void;
  pushHistory(group: PatchGroup): void;
  /** Mutable slot holding the currently-open (coalescing) group, if any. */
  readonly pending: { current: PatchGroup | null };
}

/**
 * Run a Mutative recipe, produce patches, and add them to the pending group
 * (or start a new one if the key has changed).
 */
export function commit<S>(
  ctx: CommitContext<S>,
  recipe: (draft: Draft<S>) => void,
  options: { key?: string | null } = {},
): void {
  const key = options.key ?? null;

  // Flush the open pending group FIRST if the key doesn't match. This must
  // happen before computing `next`, because `pushHistory` mutates the store
  // (updating `history.past`), and we don't want `setState(next)` to clobber
  // that change with a stale snapshot.
  const open = ctx.pending.current;
  if (open && (key === null || open.key !== key)) {
    ctx.pending.current = null;
    ctx.pushHistory(open);
  }

  const base = ctx.getState();
  const [next, patches, inverse] = create(base, recipe, {
    enablePatches: true,
    enableAutoFreeze: false,
  }) as [S, Patches, Patches];

  if (patches.length === 0) return;

  const now =
    typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();

  const pending = ctx.pending.current;
  if (pending && key !== null && pending.key === key) {
    // Append forward patches; prepend inverse patches so undo unwinds LIFO.
    ctx.pending.current = {
      ...pending,
      ts: now,
      patches: [...pending.patches, ...patches],
      inverse: [...inverse, ...pending.inverse],
    };
  } else {
    ctx.pending.current = {
      id: nextPatchGroupId(),
      key,
      ts: now,
      patches,
      inverse,
    };
  }
  ctx.setState(next);
}

/** Seal the currently-open pending group (if any) and push it to history. */
export function flush<S>(ctx: CommitContext<S>): void {
  const pending = ctx.pending.current;
  if (!pending) return;
  ctx.pending.current = null;
  ctx.pushHistory(pending);
}

/**
 * Commit a mutation and flush in one call. Used for discrete (non-coalescing)
 * actions like clicks / keyboard shortcuts / panel inputs.
 */
export function commitImmediate<S>(ctx: CommitContext<S>, recipe: (draft: Draft<S>) => void): void {
  commit(ctx, recipe);
  flush(ctx);
}
