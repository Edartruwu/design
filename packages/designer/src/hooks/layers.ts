"use client";

import { useCallback } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useLayers as useLayersSnapshot } from "../state/bridges/useLayers.ts";
import { useLayersWithStyles as useLayersWithStylesSnapshot } from "../state/bridges/useLayersWithStyles.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import type { LayerShell } from "../state/core/types.ts";
import {
  addLayer,
  bringToFront,
  deleteLayer,
  sendToBack,
  setLayerProperty,
  toggleHidden,
  toggleLocked,
} from "../state/slices/layers.ts";
import { setSelection } from "../state/slices/selection.ts";
import { buildLayerSnapshot } from "../state/utils/snapshot.ts";
import type { UseLayersAction } from "../types/actions.ts";
import { asLayerId, type LayerId } from "../types/brand.ts";
import type { Layer, LayerType, LayerWithStyles } from "../types/layer.ts";

// Re-export the bridge-backed snapshot hooks with their public names.
export const useLayers = useLayersSnapshot;
export const useLayersWithStyles = useLayersWithStylesSnapshot;

export function useSelectedLayerIds(): readonly LayerId[] {
  const store = useDesignerStore();
  return useStoreSlice(
    store,
    (s) => s.selection.ids,
    (a, b) => a === b,
  );
}

export function useSelectedLayers(): readonly Layer[] {
  const layers = useLayers();
  const ids = useSelectedLayerIds();
  // Small O(n) filter. At ~10s of selected layers + 100s of total this is ~μs.
  return layers.filter((l) => ids.includes(l.id));
}

export function useSelectedLayerTypes(): readonly string[] {
  const selected = useSelectedLayers();
  return Array.from(new Set(selected.map((l) => l.type))).sort();
}

export function useSetSelectedLayers(): (layers: readonly Layer[] | readonly LayerId[]) => void {
  const store = useDesignerStore();
  return useCallback(
    (input) => {
      const ids: LayerId[] = [];
      for (const item of input) {
        if (typeof item === "string") ids.push(item as LayerId);
        else ids.push(item.id);
      }
      commitImmediate(store.commitCtx, (draft) => setSelection(draft, ids));
    },
    [store],
  );
}

export type AddLayerInput = Omit<Layer, "id"> & { id?: LayerId | string };

function toShell(layer: AddLayerInput, genId: () => LayerId): LayerShell {
  const id = layer.id ? asLayerId(String(layer.id)) : genId();
  const cssVars = layer.cssVars ?? {};
  return {
    id,
    name: layer.name,
    type: layer.type,
    isLocked: layer.isLocked ?? false,
    isHidden: layer.isHidden ?? false,
    meta: layer.meta ?? {},
    cssVarKeys: Object.keys(cssVars),
    version: 1,
  };
}

export function useAddLayers(): (layers: readonly AddLayerInput[]) => LayerId[] {
  const store = useDesignerStore();
  return useCallback(
    (inputs) => {
      const newIds: LayerId[] = [];
      commitImmediate(store.commitCtx, (draft) => {
        for (const input of inputs) {
          const genId = () =>
            asLayerId(`L-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);
          const shell = toShell(input, genId);
          addLayer(draft, shell);
          newIds.push(shell.id);
          // Seed signals outside the draft; registry is imperative.
          store.signals.hydrate(
            shell.id,
            (input.cssVars ?? {}) as Record<string, string>,
            typeof input.value === "string" ? input.value : "",
          );
        }
      });
      return newIds;
    },
    [store],
  );
}

export function useDeleteLayers(): (ids: readonly LayerId[]) => void {
  const store = useDesignerStore();
  return useCallback(
    (ids) => {
      commitImmediate(store.commitCtx, (draft) => {
        for (const id of ids) {
          store.signals.tombstone(id);
          deleteLayer(draft, id);
        }
      });
    },
    [store],
  );
}

export function useGetLayers(): (ids: readonly LayerId[]) => Layer[] {
  const store = useDesignerStore();
  return useCallback(
    (ids) => {
      const snapshot = buildLayerSnapshot(store.getState(), store.signals);
      return snapshot.filter((l) => ids.includes(l.id));
    },
    [store],
  );
}

export function useSetLayersProperty(): <K extends "name" | "isLocked" | "isHidden" | "meta">(
  ids: readonly LayerId[],
  key: K,
  value: LayerShell[K],
) => void {
  const store = useDesignerStore();
  return useCallback(
    (ids, key, value) => {
      commitImmediate(store.commitCtx, (draft) => {
        for (const id of ids) setLayerProperty(draft, id, key, value);
      });
    },
    [store],
  );
}

export function useLayersAction(): UseLayersAction {
  const store = useDesignerStore();
  return useCallback(
    (verb, ...payload) => {
      const ids = (payload[0] ?? []) as readonly LayerId[];
      commitImmediate(store.commitCtx, (draft) => {
        switch (verb) {
          case "DUPLICATE_LAYER": {
            // Duplicate: copy each shell with a new id; copy signals.
            for (const id of ids) {
              const shell = draft.layers.layersById[id];
              if (!shell) continue;
              const newId = asLayerId(
                `L-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
              );
              const duplicate: LayerShell = {
                ...shell,
                id: newId,
                name: `${shell.name} copy`,
                cssVarKeys: [...shell.cssVarKeys],
                meta: { ...shell.meta },
                version: 1,
              };
              addLayer(draft, duplicate);
              const srcVars = store.signals.snapshotCssVars(id);
              store.signals.hydrate(newId, srcVars, store.signals.value(id).peek());
            }
            break;
          }
          case "DELETE_LAYER":
            for (const id of ids) {
              store.signals.tombstone(id);
              deleteLayer(draft, id);
            }
            break;
          case "SHOW_HIDE_LAYER":
            toggleHidden(draft, ids);
            break;
          case "BRING_TO_FRONT":
            bringToFront(draft, ids);
            break;
          case "SEND_TO_BACK":
            sendToBack(draft, ids);
            break;
          case "LOCK_UNLOCK_LAYER":
            toggleLocked(draft, ids);
            break;
        }
      });
    },
    [store],
  ) as UseLayersAction;
}

export function useLayerTypes(): readonly LayerType[] {
  const store = useDesignerStore();
  const registry = useStoreSlice(
    store,
    (s) => s.layerTypes.registry,
    (a, b) => a === b,
  );
  return Object.values(registry);
}

// Re-export the snapshot type since consumers commonly destructure it.
export type { LayerWithStyles };
