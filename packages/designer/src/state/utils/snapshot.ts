/**
 * Build a public `Layer[]` snapshot from cold shells (Zustand) and hot
 * signal values (registry). Used by:
 *  - `useLayers()` / `useLayersWithStyles()` for React consumers.
 *  - Controlled mode's `onLayersChange` emitter.
 */

import { asLayerId } from "../../types/brand.ts";
import type { Layer } from "../../types/layer.ts";
import type { DesignerState } from "../core/types.ts";
import type { SignalRegistry } from "../signals/registry.ts";

export function buildLayerSnapshot(state: DesignerState, signals: SignalRegistry): Layer[] {
  const out: Layer[] = new Array(state.layers.order.length);
  for (let i = 0; i < state.layers.order.length; i++) {
    const id = state.layers.order[i];
    if (!id) continue;
    const shell = state.layers.layersById[id];
    if (!shell) continue;
    const cssVars = signals.snapshotCssVars(id);
    const valueSig = signals.value(id);
    const layer: Layer = {
      id: asLayerId(id),
      name: shell.name,
      type: shell.type,
      value: valueSig.peek(),
      ...(Object.keys(cssVars).length ? { cssVars } : {}),
      ...(Object.keys(shell.meta).length ? { meta: { ...shell.meta } } : {}),
      ...(shell.isLocked ? { isLocked: true } : {}),
      ...(shell.isHidden ? { isHidden: true } : {}),
    };
    out[i] = layer;
  }
  return out;
}
