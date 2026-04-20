/**
 * Type-level tests for the `LayerCssVar` / `CSSVars` surface.
 *
 * Known names must autocomplete; arbitrary `--foo` names must still compile
 * (escape hatch); non-custom-property strings compile too because CSS
 * variable names are fundamentally free-form — the autocomplete benefit is
 * the main win, not strict enforcement.
 */

import type { CSSVars } from "../../src/index.ts";

// ── known names resolve through autocomplete
const geometry: CSSVars = {
  "--width": "100px",
  "--height": "50mm",
  "--translate-x": "10px",
  "--translate-y": "20px",
  "--rotate": "45deg",
  "--transform-matrix": "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)",
};

// ── escape hatch accepts user-defined custom properties
const customVar: CSSVars = { "--my-custom-thing": "foo" };

const borders: CSSVars = {
  "--border-top-width": "1px",
  "--border-top-color": "red",
  "--padding-left": "8px",
};
