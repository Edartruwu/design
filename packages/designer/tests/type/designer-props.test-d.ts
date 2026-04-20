/**
 * Type-level tests for the public Designer prop shape.
 *
 * These files are not executed as unit tests; they are validated by
 * `tsc --noEmit` (or `vitest --typecheck`). A `@ts-expect-error` that does
 * NOT produce an error fails the build, which is how we catch regressions to
 * the discriminated union.
 */

import type {
  DesignerControlledProps,
  DesignerProps,
  DesignerUncontrolledProps,
  Layer,
} from "../../src/index.ts";

const layers: Layer[] = [];
const onLayersChange = (_: readonly Layer[]) => {};

// ── valid: pure uncontrolled
const okUncontrolled: DesignerProps = {};

// ── valid: uncontrolled with default seed
const okDefault: DesignerProps = { defaultLayers: layers };

// ── valid: controlled
const okControlled: DesignerProps = { layers, onLayersChange };

// ── invalid: controlled without onLayersChange
// @ts-expect-error — layers requires onLayersChange
const missingHandler: DesignerProps = { layers };

// ── invalid: mixing controlled + uncontrolled
// @ts-expect-error — cannot pass both layers and defaultLayers
const bothModes: DesignerProps = { layers, onLayersChange, defaultLayers: layers };

// ── invalid: onLayersChange without layers is also not well-formed
// @ts-expect-error — onLayersChange is never on Uncontrolled
const strayHandler: DesignerUncontrolledProps = { onLayersChange };

// ── valid: controlled union narrowing
function takesControlled(_: DesignerControlledProps) {}
takesControlled({ layers, onLayersChange });
