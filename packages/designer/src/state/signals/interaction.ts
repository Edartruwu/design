/**
 * Global interaction state — a tiny signal that advertises which gesture is
 * currently in flight. Consumed by `commit()` to skip pushing mid-gesture
 * patches to the history stack (coalesced at flush time instead).
 */

import { createSignal, type Signal } from "./engine.ts";

export type InteractionKind = "idle" | "drag" | "resize" | "rotate" | "scrub" | "marquee";

export interface InteractionState {
  readonly kind: InteractionKind;
  /** Opaque id of the active gesture (used as coalescing key for commits). */
  readonly gestureId: string | null;
  readonly startedAt: number;
}

export type InteractionSignal = Signal<InteractionState>;

export const IDLE: InteractionState = {
  kind: "idle",
  gestureId: null,
  startedAt: 0,
};

export function createInteractionSignal(): InteractionSignal {
  return createSignal<InteractionState>(IDLE);
}
