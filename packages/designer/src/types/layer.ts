import type { CSSProperties, ReactNode } from "react";
import type { LayerId } from "./brand.ts";
import type { CSSVars } from "./css-vars.ts";
import type { Keybinding } from "./keybinding.ts";

/**
 * A single layer on the canvas. Fully serializable to JSON.
 *
 * Generic parameters:
 *  - `TType`  — the layer's type discriminator (e.g. `"text"`, `"image"`).
 *  - `TValue` — the shape of `layer.value` (a string for text/image URLs; can
 *    be a richer object for custom layers).
 *  - `TMeta`  — the shape of `layer.meta`, arbitrary consumer data.
 *
 * Geometry and styling live in `cssVars` (custom properties written to the
 * layer's DOM element) rather than inlined into a structured style object.
 * This keeps layers flat, serializable, and efficient to diff.
 */
export interface Layer<
  TType extends string = string,
  TValue = string,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly id: LayerId;
  readonly name: string;
  readonly type: TType;
  readonly value: TValue;
  readonly cssVars?: CSSVars;
  readonly meta?: TMeta;
  readonly isLocked?: boolean;
  readonly isHidden?: boolean;
}

/**
 * A layer augmented with computed `style` and `contentStyle` objects for
 * rendering. These are REFERENCE-STABLE across frames during a gesture — the
 * objects themselves never change; the CSS custom properties they reference
 * (`var(--width)`, `var(--transform-matrix)`, …) are mutated on the DOM node.
 * This is Strategy A from the design doc and is what allows drag to run
 * without allocating style objects per frame.
 */
export type AnyLayer = Layer<string, unknown, Record<string, unknown>>;

export type LayerWithStyles<L extends AnyLayer = AnyLayer> = L & {
  readonly style: CSSProperties;
  readonly contentStyle: CSSProperties;
};

/**
 * Defines a layer type: how to construct new layers of this type, how to
 * render them, and an optional keyboard shortcut for creating one.
 */
export interface LayerType<
  TType extends string = string,
  TValue = string,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly type: TType;
  readonly name: string;
  readonly icon?: ReactNode;
  readonly defaultValues: Omit<Layer<TType, TValue, TMeta>, "id" | "type">;
  readonly render: (layer: LayerWithStyles<Layer<TType, TValue, TMeta>>) => ReactNode;
  readonly keybinding?: Keybinding;
}
