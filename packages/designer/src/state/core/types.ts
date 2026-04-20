/**
 * Internal state types — NOT exported publicly. The public API sees `Layer`;
 * internally we keep a `LayerShell` (cold fields only) plus a parallel
 * signal registry (hot fields like cssVars / value).
 */

import type { Patches } from "mutative";
import type { LayerId } from "../../types/brand.ts";
import type { FrameSize, SnapSettings } from "../../types/frame.ts";
import type { Keybinding } from "../../types/keybinding.ts";
import type { LayerType } from "../../types/layer.ts";
import type { Mode, Tool } from "../../types/tool.ts";
import type { Unit } from "../../types/unit.ts";

export interface LayerShell {
  readonly id: LayerId;
  readonly name: string;
  readonly type: string;
  readonly isLocked: boolean;
  readonly isHidden: boolean;
  readonly meta: Record<string, unknown>;
  /** Ordered list of cssVar names registered in the signal registry. */
  readonly cssVarKeys: readonly string[];
  /** Monotonic, bumped on structural changes — drives useLayers() memoization. */
  readonly version: number;
}

export interface PatchGroup {
  readonly id: string;
  readonly key: string | null;
  readonly ts: number;
  readonly patches: Patches;
  readonly inverse: Patches;
}

export interface HistoryState {
  readonly past: readonly PatchGroup[];
  readonly future: readonly PatchGroup[];
  readonly pendingGroup: PatchGroup | null;
}

export interface LayersSlice {
  readonly layersById: Readonly<Record<string, LayerShell>>;
  /** Render order (bottom → top). */
  readonly order: readonly LayerId[];
  /** Aggregate version — bumped whenever any shell's `version` bumps. */
  readonly byIdVersion: number;
}

export interface SelectionSlice {
  readonly ids: readonly LayerId[];
  readonly signature: number;
}

export interface KeybindingsSlice {
  readonly bindings: Readonly<Record<string, Keybinding>>;
  readonly overrides: Readonly<Record<string, Keybinding>>;
}

export interface UnitsSlice {
  readonly unit: Unit;
  readonly dpi: number;
}

export interface FrameSlice {
  readonly frame: FrameSize;
  readonly snap: SnapSettings;
}

export interface ZoomSlice {
  /** Committed zoom level; in-progress zoom lives in an ephemeral signal. */
  readonly zoom: number;
}

export interface ToolSlice {
  readonly tool: Tool;
}

export interface DebugSlice {
  readonly debug: boolean;
}

export interface LayerTypesSlice {
  readonly registry: Readonly<Record<string, LayerType>>;
}

export interface ModeSlice {
  readonly mode: Mode;
  readonly controlled: boolean;
  /** Ring of recently-committed patch-group ids; used to suppress echoes. */
  readonly outboundIds: readonly string[];
}

/**
 * The complete root state shape. All state is immutable-from-consumer
 * perspective; Mutative draft recipes are the only mutation path.
 */
export interface DesignerState {
  readonly layers: LayersSlice;
  readonly selection: SelectionSlice;
  readonly history: HistoryState;
  readonly keybindings: KeybindingsSlice;
  readonly units: UnitsSlice;
  readonly frame: FrameSlice;
  readonly zoom: ZoomSlice;
  readonly tool: ToolSlice;
  readonly debug: DebugSlice;
  readonly layerTypes: LayerTypesSlice;
  readonly mode: ModeSlice;
}
