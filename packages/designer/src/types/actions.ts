import type { LayerId } from "./brand.ts";

/**
 * Verb-payload map for **designer-level** actions.
 *
 * To add a custom verb, consumers augment this interface:
 *
 * ```ts
 * declare module "@inedge/designer" {
 *   interface DesignerActionMap { MY_VERB: { foo: string } }
 * }
 * ```
 *
 * Payloads that don't need data use `undefined` — the callable type erases
 * the second argument in that case via the rest-tuple trick below.
 */
export interface DesignerActionMap {
  ZOOM_IN: undefined;
  ZOOM_OUT: undefined;
  ZOOM_RESET: undefined;
  ZOOM_100: undefined;
  ZOOM_FIT: undefined;
  REDRAW: undefined;
  UNSELECT_ALL: undefined;
  HISTORY_UNDO: undefined;
  HISTORY_REDO: undefined;
}

export type DesignerActionVerb = keyof DesignerActionMap;

/**
 * Verb-payload map for **layer** actions (apply to the given layer ids).
 *
 * Same augmentation pattern as DesignerActionMap.
 */
export interface LayerActionMap {
  DUPLICATE_LAYER: readonly LayerId[];
  DELETE_LAYER: readonly LayerId[];
  SHOW_HIDE_LAYER: readonly LayerId[];
  BRING_TO_FRONT: readonly LayerId[];
  SEND_TO_BACK: readonly LayerId[];
  LOCK_UNLOCK_LAYER: readonly LayerId[];
}

export type LayerActionVerb = keyof LayerActionMap;

/**
 * Rest-tuple inference: when the payload is `undefined`, the callable takes
 * just the verb; otherwise it takes verb + payload. TS infers the exact
 * payload type from the literal verb passed in.
 */
type VerbArgs<Map, V extends keyof Map> = Map[V] extends undefined ? [] : [Map[V]];

export type UseDesignerAction = <V extends DesignerActionVerb>(
  verb: V,
  ...payload: VerbArgs<DesignerActionMap, V>
) => void;

export type UseLayersAction = <V extends LayerActionVerb>(
  verb: V,
  ...payload: VerbArgs<LayerActionMap, V>
) => void;
