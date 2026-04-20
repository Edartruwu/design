/**
 * @inedge/designer — main public entry.
 *
 * This barrel re-exports the full public surface. Internal paths
 * (`src/state/...`, `src/canvas/...`) are NOT public; consumers should only
 * import from `@inedge/designer`, `@inedge/designer/ui`,
 * `@inedge/designer/utils`, or `@inedge/designer/static`.
 */

export * from "./hooks/index.ts";
export * from "./types/index.ts";

export const __VERSION__ = "0.0.0";
