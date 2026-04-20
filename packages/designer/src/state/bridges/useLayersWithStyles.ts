"use client";

/**
 * `useLayersWithStyles()` — Strategy-A enrichment of `useLayers()`.
 *
 * Each layer is wrapped with `style` and `contentStyle` objects that are
 * reference-stable across frames. These objects contain CSS properties
 * written as `var(--x)` references; the actual values live in CSS custom
 * properties on the layer's DOM node, driven imperatively by signal
 * subscribers in `<DesignerLayer>`. That's why dragging a layer can run at
 * 120 Hz without allocating any CSSProperties per frame.
 *
 * The returned array is reference-stable until the underlying `Layer[]`
 * array changes (i.e., structural change). Signal ticks do NOT invalidate
 * it — cssVar changes hit the DOM directly and never enter React's render
 * path.
 */

import type { CSSProperties } from "react";
import { useMemo } from "react";
import type { Layer, LayerWithStyles } from "../../types/layer.ts";
import { useLayers } from "./useLayers.ts";

const BASE_STYLE: CSSProperties = Object.freeze({
  position: "absolute" as const,
  top: 0,
  left: 0,
  transform: "var(--transform-matrix, none)",
  transformOrigin: "0 0",
  width: "var(--width, auto)",
  height: "var(--height, auto)",
  backgroundColor: "var(--background-color)",
  color: "var(--color)",
  borderRadius: "var(--border-radius, 0)",
  opacity: "var(--opacity, 1)",
  filter: "var(--filter, none)",
  boxShadow: "var(--box-shadow, none)",
  zIndex: "var(--z-index, auto)" as unknown as number, // CSS accepts strings at runtime
});

const BASE_CONTENT_STYLE: CSSProperties = Object.freeze({
  fontSize: "var(--content-font-size, var(--font-size, inherit))",
  fontWeight: "var(--font-weight, inherit)",
  fontFamily: "var(--font-family, inherit)",
  lineHeight: "var(--content-line-height, var(--line-height, normal))",
  letterSpacing: "var(--content-letter-spacing, var(--letter-spacing, normal))",
  color: "var(--content-color, var(--color, inherit))",
  textAlign: "var(--text-align, inherit)" as CSSProperties["textAlign"],
  textDecoration: "var(--text-decoration, inherit)",
  textTransform: "var(--text-transform, inherit)" as CSSProperties["textTransform"],
  textShadow: "var(--text-shadow, none)",
});

export function useLayersWithStyles(): readonly LayerWithStyles<Layer>[] {
  const layers = useLayers();
  return useMemo(() => {
    const out: LayerWithStyles<Layer>[] = new Array(layers.length);
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (!layer) continue;
      out[i] = {
        ...layer,
        style: BASE_STYLE,
        contentStyle: BASE_CONTENT_STYLE,
      };
    }
    return out;
  }, [layers]);
}
