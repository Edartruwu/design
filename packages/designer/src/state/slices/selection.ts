import type { Draft } from "mutative";
import type { LayerId } from "../../types/brand.ts";
import type { DesignerState } from "../core/types.ts";

type S = Draft<DesignerState>;

export function setSelection(draft: S, ids: readonly LayerId[]): void {
  const known = new Set(Object.keys(draft.layers.layersById));
  const next = ids.filter((id) => known.has(id));
  if (next.length === draft.selection.ids.length) {
    let same = true;
    for (let i = 0; i < next.length; i++) {
      if (next[i] !== draft.selection.ids[i]) {
        same = false;
        break;
      }
    }
    if (same) return;
  }
  (draft.selection.ids as LayerId[]).length = 0;
  (draft.selection.ids as LayerId[]).push(...next);
  draft.selection.signature++;
}

export function toggleSelection(draft: S, id: LayerId): void {
  const list = draft.selection.ids as LayerId[];
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else if (draft.layers.layersById[id]) {
    list.push(id);
  }
  draft.selection.signature++;
}

export function unselectAll(draft: S): void {
  if (draft.selection.ids.length === 0) return;
  (draft.selection.ids as LayerId[]).length = 0;
  draft.selection.signature++;
}
