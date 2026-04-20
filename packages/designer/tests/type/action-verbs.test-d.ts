/**
 * Type-level tests for verb-payload inference on
 * `UseLayersAction` and `UseDesignerAction`.
 */

import type { UseDesignerAction, UseLayersAction } from "../../src/index.ts";
import { asLayerId } from "../../src/index.ts";

declare const designerAction: UseDesignerAction;
declare const layersAction: UseLayersAction;

const id = asLayerId("a");

// ── designer actions: all are void payloads
designerAction("ZOOM_IN");
designerAction("ZOOM_FIT");
designerAction("HISTORY_UNDO");

// @ts-expect-error — ZOOM_IN takes no payload
designerAction("ZOOM_IN", 42);

// @ts-expect-error — unknown verb
designerAction("ZOOM_SOMEWHERE");

// ── layer actions: payload is LayerId[]
layersAction("DUPLICATE_LAYER", [id]);
layersAction("DELETE_LAYER", [id, id]);
layersAction("LOCK_UNLOCK_LAYER", []);

// @ts-expect-error — DUPLICATE_LAYER requires a payload
layersAction("DUPLICATE_LAYER");

// @ts-expect-error — payload must be LayerId[], not string[]
layersAction("DUPLICATE_LAYER", ["raw-string"]);

// @ts-expect-error — unknown verb
layersAction("PAINT_RED", [id]);
