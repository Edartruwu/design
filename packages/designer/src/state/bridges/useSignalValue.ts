"use client";

/**
 * React bridge for a single alien-signal. Subscribes via the signal's own
 * `.subscribe()` (valueful) but funnels through `useSyncExternalStore` so
 * reads are concurrent-mode-safe.
 *
 * This is the PRIMARY hook used by control components (InputNumber, Slider,
 * ColorPicker) that need to render the current signal value. Layer DOM
 * elements themselves DO NOT use this — they bind signals directly to
 * `element.style.setProperty` via a raw effect in `DesignerLayer.tsx`,
 * bypassing React entirely on the drag hot path.
 */

import { useSyncExternalStore } from "react";
import type { Signal } from "../signals/engine.ts";
import { watch } from "../signals/engine.ts";

export function useSignalValue<T>(signal: Signal<T>): T {
  return useSyncExternalStore(
    (onChange) => watch(signal, onChange),
    () => signal.peek(),
    () => signal.peek(),
  );
}
