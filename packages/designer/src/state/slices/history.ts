/**
 * History mutations — undo/redo only. Normal commits go through `commit()`
 * which pushes to `past` directly; this slice provides the reverse ops.
 *
 * Patches are applied via Mutative's `apply`, which walks the patch list in
 * order. Inverse patches were stored in LIFO order at commit time so that
 * they unwind the forward group correctly when applied.
 */

import { apply } from "mutative";
import type { DesignerState, PatchGroup } from "../core/types.ts";

/**
 * Pop the top of `past`, apply its inverse, push onto `future`. Returns the
 * next full state (not a draft — this function is NOT called through Mutative
 * because `apply` already produces an immutable next value).
 */
export function applyUndo(state: DesignerState): DesignerState | null {
  const past = state.history.past;
  if (past.length === 0) return null;
  const group = past[past.length - 1] as PatchGroup;
  const next = apply(state, group.inverse) as DesignerState;
  return {
    ...next,
    history: {
      past: past.slice(0, -1),
      future: [group, ...state.history.future],
      pendingGroup: state.history.pendingGroup,
    },
  };
}

/** Symmetric to `applyUndo`. */
export function applyRedo(state: DesignerState): DesignerState | null {
  const future = state.history.future;
  if (future.length === 0) return null;
  const group = future[0] as PatchGroup;
  const next = apply(state, group.patches) as DesignerState;
  return {
    ...next,
    history: {
      past: [...state.history.past, group],
      future: future.slice(1),
      pendingGroup: state.history.pendingGroup,
    },
  };
}
