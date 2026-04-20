/**
 * Layer slice mutation recipes.
 *
 * Each exported function is a Mutative draft recipe: `(draft) => void`,
 * plus whatever parameters it needs. Recipes never return anything —
 * Mutative captures their mutations as patches.
 */

import type { Draft } from "mutative";
import type { LayerId } from "../../types/brand.ts";
import type { DesignerState, LayerShell } from "../core/types.ts";

type S = Draft<DesignerState>;

function bumpVersion(draft: S, id: LayerId): void {
  const shell = draft.layers.layersById[id];
  if (!shell) return;
  // Mutative allows direct mutation of drafts, including readonly fields
  // at the runtime level — the readonly markers are a TS-only contract.
  (shell as { version: number }).version = shell.version + 1;
  draft.layers.byIdVersion++;
}

export function addLayer(draft: S, shell: LayerShell, atIndex?: number): void {
  if (draft.layers.layersById[shell.id]) return;
  (draft.layers.layersById as Record<string, LayerShell>)[shell.id] = shell;
  if (atIndex === undefined || atIndex >= draft.layers.order.length) {
    (draft.layers.order as LayerId[]).push(shell.id);
  } else {
    (draft.layers.order as LayerId[]).splice(atIndex, 0, shell.id);
  }
  draft.layers.byIdVersion++;
}

export function deleteLayer(draft: S, id: LayerId): void {
  const exists = draft.layers.layersById[id];
  if (!exists) return;
  delete (draft.layers.layersById as Record<string, LayerShell>)[id];
  const idx = draft.layers.order.indexOf(id);
  if (idx >= 0) (draft.layers.order as LayerId[]).splice(idx, 1);
  // Clear from selection if selected.
  const selIdx = draft.selection.ids.indexOf(id);
  if (selIdx >= 0) {
    (draft.selection.ids as LayerId[]).splice(selIdx, 1);
    draft.selection.signature++;
  }
  draft.layers.byIdVersion++;
}

export function setLayerProperty<K extends Exclude<keyof LayerShell, "id">>(
  draft: S,
  id: LayerId,
  key: K,
  value: LayerShell[K],
): void {
  const shell = draft.layers.layersById[id];
  if (!shell) return;
  (shell as Record<string, unknown>)[key as string] = value;
  bumpVersion(draft, id);
}

export function reorderLayers(draft: S, ids: readonly LayerId[]): void {
  // Replace order with the new list, keeping only ids that still exist.
  const known = new Set(Object.keys(draft.layers.layersById));
  const next: LayerId[] = [];
  for (const id of ids) {
    if (known.has(id)) next.push(id);
  }
  // Append any layers not mentioned (stable tail).
  for (const id of draft.layers.order) {
    if (!ids.includes(id) && known.has(id)) next.push(id);
  }
  (draft.layers.order as LayerId[]).length = 0;
  (draft.layers.order as LayerId[]).push(...next);
  draft.layers.byIdVersion++;
}

export function bringToFront(draft: S, ids: readonly LayerId[]): void {
  const order = draft.layers.order as LayerId[];
  const set = new Set(ids);
  const kept = order.filter((id) => !set.has(id));
  const moved = order.filter((id) => set.has(id));
  order.length = 0;
  order.push(...kept, ...moved);
  draft.layers.byIdVersion++;
}

export function sendToBack(draft: S, ids: readonly LayerId[]): void {
  const order = draft.layers.order as LayerId[];
  const set = new Set(ids);
  const moved = order.filter((id) => set.has(id));
  const kept = order.filter((id) => !set.has(id));
  order.length = 0;
  order.push(...moved, ...kept);
  draft.layers.byIdVersion++;
}

export function toggleLocked(draft: S, ids: readonly LayerId[]): void {
  for (const id of ids) {
    const shell = draft.layers.layersById[id];
    if (!shell) continue;
    (shell as { isLocked: boolean }).isLocked = !shell.isLocked;
    bumpVersion(draft, id);
  }
}

export function toggleHidden(draft: S, ids: readonly LayerId[]): void {
  for (const id of ids) {
    const shell = draft.layers.layersById[id];
    if (!shell) continue;
    (shell as { isHidden: boolean }).isHidden = !shell.isHidden;
    bumpVersion(draft, id);
  }
}

/**
 * Commit a cssVar snapshot to the shell (used by gesture lifecycle at flush
 * time, once signal-side changes settle). This only updates `cssVarKeys`
 * and bumps version; values live in signals, not shell.
 */
export function recordCssVarKeys(draft: S, id: LayerId, keys: readonly string[]): void {
  const shell = draft.layers.layersById[id];
  if (!shell) return;
  const existing = new Set(shell.cssVarKeys);
  let changed = false;
  for (const k of keys) {
    if (!existing.has(k)) {
      (shell.cssVarKeys as string[]).push(k);
      existing.add(k);
      changed = true;
    }
  }
  if (changed) bumpVersion(draft, id);
}
