/**
 * Hydration: convert a public `Layer[]` input into:
 *  - cold `LayerShell` objects inserted into a draft,
 *  - signal initializations pushed through the registry.
 *
 * Used at:
 *  - `<Designer>` mount with `defaultLayers` or `layers` prop.
 *  - Controlled-mode prop updates (via `diff.ts` in Phase 1c).
 *  - Persistence rehydration.
 */

import type { Draft } from "mutative";
import { asLayerId, type LayerId } from "../../types/brand.ts";
import type { Layer } from "../../types/layer.ts";
import type { DesignerState, LayerShell } from "../core/types.ts";
import type { SignalRegistry } from "../signals/registry.ts";

type S = Draft<DesignerState>;

export function hydrateLayers(draft: S, signals: SignalRegistry, layers: readonly Layer[]): void {
  // Clear prior content.
  (draft.layers.order as LayerId[]).length = 0;
  for (const k of Object.keys(draft.layers.layersById)) {
    delete (draft.layers.layersById as Record<string, LayerShell>)[k];
  }

  for (const layer of layers) {
    const id = asLayerId(layer.id);
    const cssVars = layer.cssVars ?? {};
    const cssVarKeys = Object.keys(cssVars);

    const shell: LayerShell = {
      id,
      name: layer.name,
      type: layer.type,
      isLocked: layer.isLocked ?? false,
      isHidden: layer.isHidden ?? false,
      meta: layer.meta ?? {},
      cssVarKeys,
      version: 1,
    };
    (draft.layers.layersById as Record<string, LayerShell>)[id] = shell;
    (draft.layers.order as LayerId[]).push(id);

    // Seed signals. This happens outside the Mutative producer because
    // signals are imperative state — which is exactly why they're in a
    // WeakRef registry and not in the Zustand tree.
    signals.hydrate(
      id,
      cssVars as Record<string, string>,
      typeof layer.value === "string" ? layer.value : "",
    );
  }
  draft.layers.byIdVersion++;
}
