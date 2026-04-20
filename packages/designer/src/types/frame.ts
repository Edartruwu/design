import type { Unit } from "./unit.ts";

/**
 * Frame dimensions — the size of the artboard. `unit` defaults to `px`; set
 * it to `mm` / `in` / `pt` for print-oriented documents.
 */
export interface FrameSize {
  readonly width: number;
  readonly height: number;
  readonly unit?: Unit;
}

/**
 * Optional print-safe margins overlaid on the frame.
 *
 * `position: "css"` means values are in CSS units (insets from each edge),
 * which matches how the compositor interprets them when rendered as an
 * overlay.
 */
export interface FrameBounds {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly position: "css";
}

/**
 * Snapping behavior during drag / resize.
 *
 * `threshold` is in SCREEN pixels, not canvas pixels, so snap strength feels
 * consistent across zoom levels.
 */
export interface SnapSettings {
  readonly enabled: boolean;
  readonly threshold: number;
  readonly snapToEdges: boolean;
  readonly snapToCenters: boolean;
  readonly snapToGuides: boolean;
  readonly snapToGrid: boolean;
}

export const DEFAULT_SNAP: SnapSettings = {
  enabled: true,
  threshold: 8,
  snapToEdges: true,
  snapToCenters: true,
  snapToGuides: true,
  snapToGrid: false,
} as const;
