/**
 * Settings-style slices that map 1:1 to simple setter actions:
 * zoom, tool, units, DPI, frame size, debug, mode, targets, keybindings.
 */

import type { Draft } from "mutative";
import type { FrameSize, SnapSettings } from "../../types/frame.ts";
import type { Keybinding } from "../../types/keybinding.ts";
import type { Mode, Tool } from "../../types/tool.ts";
import type { Unit } from "../../types/unit.ts";
import type { DesignerState } from "../core/types.ts";

type S = Draft<DesignerState>;

export function setZoom(draft: S, value: number): void {
  const clamped = Math.max(0.1, Math.min(3, value));
  if (draft.zoom.zoom === clamped) return;
  draft.zoom.zoom = clamped;
}

export function setTool(draft: S, tool: Tool): void {
  if (draft.tool.tool === tool) return;
  draft.tool.tool = tool;
}

export function setUnit(draft: S, unit: Unit): void {
  if (draft.units.unit === unit) return;
  draft.units.unit = unit;
}

export function setDpi(draft: S, dpi: number): void {
  const clamped = Math.max(1, Math.floor(dpi));
  if (draft.units.dpi === clamped) return;
  draft.units.dpi = clamped;
}

export function setFrameSize(draft: S, size: FrameSize): void {
  draft.frame.frame = { ...size };
}

export function setSnap(draft: S, partial: Partial<SnapSettings>): void {
  draft.frame.snap = { ...draft.frame.snap, ...partial };
}

export function setDebug(draft: S, on: boolean): void {
  if (draft.debug.debug === on) return;
  draft.debug.debug = on;
}

export function setMode(draft: S, mode: Mode): void {
  if (draft.mode.mode === mode) return;
  draft.mode.mode = mode;
}

export function setKeybinding(draft: S, name: string, binding: Keybinding | null): void {
  const overrides = draft.keybindings.overrides as Record<string, Keybinding>;
  if (binding === null) {
    delete overrides[name];
  } else {
    overrides[name] = binding;
  }
}

export function recordOutboundCommit(draft: S, id: string): void {
  const ring = draft.mode.outboundIds as string[];
  ring.push(id);
  const MAX = 32;
  if (ring.length > MAX) ring.splice(0, ring.length - MAX);
}
