/**
 * CSS custom-property surface.
 *
 * Every layer's geometry / styling is a set of CSS custom properties written
 * on the layer's DOM element. The hot path during drag writes a single
 * `--transform-matrix` var; mirrors (`--translate-x`, `--rotate`, `--scale-x`,
 * `--scale-y`) exist for DevTools inspection but are not the primary channel.
 *
 * The `LayerCssVar` union preserves autocomplete for the known names while the
 * `(string & {})` escape hatch accepts arbitrary user-defined vars without
 * suppressing the autocomplete for the known ones — a well-known TS trick.
 */

type BorderSide = "top" | "right" | "bottom" | "left";
type BorderProp = "width" | "color" | "style";
type SpacingBox = `--${"padding" | "margin"}-${BorderSide}`;
type BorderBox = `--border-${BorderSide}-${BorderProp}`;

export type KnownLayerCssVar =
  // geometry / transform
  | "--width"
  | "--height"
  | "--translate-x"
  | "--translate-y"
  | "--rotate"
  | "--scale-x"
  | "--scale-y"
  | "--transform-matrix"
  | "--transform-origin"
  | "--z-index"
  // box / background
  | "--background-color"
  | "--background-image"
  | "--border-radius"
  | "--opacity"
  | BorderBox
  | SpacingBox
  // typography
  | "--color"
  | "--font-family"
  | "--font-size"
  | "--font-weight"
  | "--font-style"
  | "--line-height"
  | "--letter-spacing"
  | "--text-align"
  | "--text-decoration"
  | "--text-transform"
  | "--text-shadow"
  | "--text-stroke"
  // effects
  | "--box-shadow"
  | "--filter"
  | "--filter-blur"
  | "--filter-brightness"
  | "--filter-contrast"
  | "--filter-saturate"
  | "--filter-hue-rotate"
  | "--filter-grayscale"
  | "--filter-sepia"
  | "--mix-blend-mode"
  // image
  | "--object-fit"
  | "--object-position"
  // content slot (inner element)
  | "--content-font-size"
  | "--content-font-weight"
  | "--content-line-height"
  | "--content-letter-spacing"
  | "--content-color";

/**
 * Any CSS custom property name starting with `--`. The (string & {}) trick
 * preserves autocomplete for `KnownLayerCssVar` while still accepting
 * arbitrary user-defined vars.
 */
export type LayerCssVar = KnownLayerCssVar | (string & {});

/**
 * A bag of CSS custom properties. Values are strings because CSS variables
 * are always string-valued at the DOM level; numeric inputs get serialized
 * through `createLayerCssVarAction(..., { serialize })`.
 */
export type CSSVars = Partial<Record<LayerCssVar, string>>;
