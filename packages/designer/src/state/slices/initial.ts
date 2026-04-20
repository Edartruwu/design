/**
 * Initial slice values. A small module kept separate from the slice
 * reducers so that both the Zustand factory and any consumer test harness
 * can seed state the same way.
 */

import { DEFAULT_SNAP } from "../../types/frame.ts";
import type {
  DebugSlice,
  DesignerState,
  FrameSlice,
  HistoryState,
  KeybindingsSlice,
  LayersSlice,
  LayerTypesSlice,
  ModeSlice,
  SelectionSlice,
  ToolSlice,
  UnitsSlice,
  ZoomSlice,
} from "../core/types.ts";

export const initialLayersSlice: LayersSlice = {
  layersById: {},
  order: [],
  byIdVersion: 0,
};

export const initialSelectionSlice: SelectionSlice = {
  ids: [],
  signature: 0,
};

export const initialHistory: HistoryState = {
  past: [],
  future: [],
  pendingGroup: null,
};

export const initialKeybindings: KeybindingsSlice = {
  bindings: {},
  overrides: {},
};

export const initialUnits: UnitsSlice = {
  unit: "px",
  dpi: 96,
};

export const initialFrame: FrameSlice = {
  frame: { width: 1024, height: 1024, unit: "px" },
  snap: DEFAULT_SNAP,
};

export const initialZoom: ZoomSlice = {
  zoom: 1,
};

export const initialTool: ToolSlice = {
  tool: "move",
};

export const initialDebug: DebugSlice = {
  debug: false,
};

export const initialLayerTypes: LayerTypesSlice = {
  registry: {},
};

export const initialMode: ModeSlice = {
  mode: "multiple",
  controlled: false,
  outboundIds: [],
};

export const initialState: DesignerState = {
  layers: initialLayersSlice,
  selection: initialSelectionSlice,
  history: initialHistory,
  keybindings: initialKeybindings,
  units: initialUnits,
  frame: initialFrame,
  zoom: initialZoom,
  tool: initialTool,
  debug: initialDebug,
  layerTypes: initialLayerTypes,
  mode: initialMode,
};
