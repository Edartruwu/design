/**
 * Nominal (branded) type helpers.
 *
 * `LayerId` is a `string` at runtime but carries a brand at the type level so
 * callers cannot accidentally pass arbitrary strings where layer ids are
 * expected. `asLayerId` is the one sanctioned cast; prefer generating ids
 * through `generateId()` from `@inedge/designer/utils`.
 */

declare const BRAND: unique symbol;

export type Brand<T, B> = T & { readonly [BRAND]: B };

export type LayerId = Brand<string, "LayerId">;

export type GroupId = Brand<string, "GroupId">;

/** Sanctioned cast. Use only at data boundaries (parse, load, generateId). */
export function asLayerId(value: string): LayerId {
  return value as LayerId;
}

export function asGroupId(value: string): GroupId {
  return value as GroupId;
}

/**
 * A layer's rendered DOM element. The dataset contract guarantees the element
 * reflects its layer id, so hit-testing can trust it.
 */
export interface LayerTarget extends HTMLElement {
  readonly dataset: DOMStringMap & { readonly layerId: string };
}
