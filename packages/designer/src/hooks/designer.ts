"use client";

import { useCallback } from "react";
import { commitImmediate } from "../state/actions/commit.ts";
import { useSignalValue } from "../state/bridges/useSignalValue.ts";
import { useStoreSlice } from "../state/bridges/useStoreSlice.ts";
import { useDesignerStore } from "../state/core/context.tsx";
import { applyRedo, applyUndo } from "../state/slices/history.ts";
import { unselectAll } from "../state/slices/selection.ts";
import { setTool, setZoom } from "../state/slices/settings.ts";
import type { UseDesignerAction } from "../types/actions.ts";
import type { Tool } from "../types/tool.ts";

export function useDesignerTool(): Tool {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.tool.tool);
}

export function useSetDesignerTool(): (tool: Tool) => void {
  const store = useDesignerStore();
  return useCallback(
    (tool) => {
      commitImmediate(store.commitCtx, (draft) => setTool(draft, tool));
    },
    [store],
  );
}

export function useZoom(): number {
  const store = useDesignerStore();
  return useStoreSlice(store, (s) => s.zoom.zoom);
}

export function useSetZoom(): (z: number) => void {
  const store = useDesignerStore();
  return useCallback(
    (z) => {
      commitImmediate(store.commitCtx, (draft) => setZoom(draft, z));
    },
    [store],
  );
}

export function useTargets(): readonly HTMLElement[] {
  const store = useDesignerStore();
  return useSignalValue(store.targets);
}

export function useSetTargets(): (targets: readonly HTMLElement[]) => void {
  const store = useDesignerStore();
  return useCallback(
    (targets) => {
      store.targets.set(targets);
    },
    [store],
  );
}

export function useDesignerAction(): UseDesignerAction {
  const store = useDesignerStore();
  return useCallback(
    (verb) => {
      switch (verb) {
        case "ZOOM_IN":
          commitImmediate(store.commitCtx, (draft) =>
            setZoom(draft, Math.min(3, store.getState().zoom.zoom * 1.15)),
          );
          break;
        case "ZOOM_OUT":
          commitImmediate(store.commitCtx, (draft) =>
            setZoom(draft, Math.max(0.1, store.getState().zoom.zoom / 1.15)),
          );
          break;
        case "ZOOM_RESET":
        case "ZOOM_100":
          commitImmediate(store.commitCtx, (draft) => setZoom(draft, 1));
          break;
        case "ZOOM_FIT":
          // Placeholder: real implementation needs canvas + frame geometry,
          // which lives in the canvas package (Phase 2).
          break;
        case "REDRAW":
          // No-op at the state layer; canvas owns redraw. Will be wired in Phase 3.
          break;
        case "UNSELECT_ALL":
          commitImmediate(store.commitCtx, (draft) => unselectAll(draft));
          break;
        case "HISTORY_UNDO": {
          const next = applyUndo(store.getState());
          if (next) store.commitCtx.setState(next);
          break;
        }
        case "HISTORY_REDO": {
          const next = applyRedo(store.getState());
          if (next) store.commitCtx.setState(next);
          break;
        }
      }
    },
    [store],
  ) as UseDesignerAction;
}
