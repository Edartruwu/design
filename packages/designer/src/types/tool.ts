/**
 * Canvas tools.
 *
 * The core ships with `move` (select, drag, transform) and `hand` (pan only).
 * Consumers can extend via module augmentation:
 *
 * ```ts
 * declare module "@inedge/designer" {
 *   interface ToolRegistry { eyedropper: true }
 * }
 * ```
 */

export interface ToolRegistry {
  move: true;
  hand: true;
}

export type Tool = keyof ToolRegistry;

/**
 * Single vs multi-layer selection mode. Consumers can lock the editor to
 * one-layer-at-a-time workflows by setting `mode="single"`.
 */
export type Mode = "single" | "multiple";
