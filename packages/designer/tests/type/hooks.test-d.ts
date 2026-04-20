/**
 * Type-level tests for the public hook surface.
 *
 * We import from the package barrel (not deep paths) so this also verifies
 * the public exports map is intact.
 */

import type {
  FrameSize,
  Keybinding,
  Layer,
  LayerId,
  LayerType,
  SnapSettings,
  Tool,
  Unit,
} from "../../src/index.ts";
import {
  asLayerId,
  createLayerCssVarAction,
  useAddLayers,
  useCanRedo,
  useCanUndo,
  useDebug,
  useDeleteLayers,
  useDesignerAction,
  useDesignerTool,
  useDPI,
  useFrameSize,
  useGetLayers,
  useHistory,
  useIsMac,
  useKeybindings,
  useLayerCssVarAction,
  useLayers,
  useLayersAction,
  useLayersWithStyles,
  useLayerTypes,
  useRedo,
  useSelectedLayerIds,
  useSelectedLayers,
  useSelectedLayerTypes,
  useSetDebug,
  useSetDesignerTool,
  useSetDPI,
  useSetFrameSize,
  useSetKeybindings,
  useSetLayersProperty,
  useSetSelectedLayers,
  useSetSnap,
  useSetTargets,
  useSetUnitSystem,
  useSetZoom,
  useShortcut,
  useSnap,
  useTargets,
  useUndo,
  useUnitSystem,
  useZoom,
} from "../../src/index.ts";

// These are all declaration checks; this file doesn't execute.

function check_reads_and_setters(): void {
  const layers: readonly Layer[] = useLayers();
  const styled = useLayersWithStyles();
  const ids: readonly LayerId[] = useSelectedLayerIds();
  const selected: readonly Layer[] = useSelectedLayers();
  const types: readonly string[] = useSelectedLayerTypes();
  const setSelected = useSetSelectedLayers();
  setSelected(ids);
  setSelected(selected);

  const setProp = useSetLayersProperty();
  setProp(ids, "name", "new");
  setProp(ids, "isLocked", true);

  const add = useAddLayers();
  const newIds: LayerId[] = add([{ name: "x", type: "text", value: "hi" }]);

  const del = useDeleteLayers();
  del(newIds);

  const get = useGetLayers();
  const got: Layer[] = get(ids);

  const layersAction = useLayersAction();
  layersAction("DUPLICATE_LAYER", ids);
  layersAction("LOCK_UNLOCK_LAYER", ids);

  const lt: readonly LayerType[] = useLayerTypes();

  const fontSize = createLayerCssVarAction("--font-size", "16px", {
    serialize: (n: number) => `${n}px`,
    deserialize: (raw) => Number.parseInt(raw ?? "16", 10),
  });
  const [fs, setFs] = useLayerCssVarAction(fontSize);
  const fsNum: number = fs;
  setFs(24);

  const undo = useUndo();
  undo();
  const redo = useRedo();
  redo();
  const cu: boolean = useCanUndo();
  const cr: boolean = useCanRedo();
  const hv = useHistory();
  const pl: number = hv.pastLength;

  const zoom: number = useZoom();
  const setZ = useSetZoom();
  setZ(1.5);

  const tool: Tool = useDesignerTool();
  const setTool = useSetDesignerTool();
  setTool("move");

  const targets: readonly HTMLElement[] = useTargets();
  const setTargets = useSetTargets();
  setTargets(targets);

  const frame: FrameSize = useFrameSize();
  const setFrame = useSetFrameSize();
  setFrame({ width: 800, height: 600 });

  const snap: SnapSettings = useSnap();
  const setSnap = useSetSnap();
  setSnap({ enabled: false });

  const unit: Unit = useUnitSystem();
  const setUnit = useSetUnitSystem();
  setUnit("mm");
  const dpi: number = useDPI();
  const setDpi = useSetDPI();
  setDpi(300);

  const kb: Readonly<Record<string, Keybinding>> = useKeybindings();
  const setKb = useSetKeybindings();
  setKb({ MY: null });

  useShortcut("MY", () => {});

  const dbg: boolean = useDebug();
  const setDbg = useSetDebug();
  setDbg(true);

  const isMac: boolean = useIsMac();

  const designerAction = useDesignerAction();
  designerAction("ZOOM_IN");
  designerAction("HISTORY_UNDO");

  // noUnusedLocals is off for this test config, so we don't need to
  // reference every local. TS still verifies the types above.
}

// Verb payload misuses:
function check_verb_errors(): void {
  const layersAction = useLayersAction();
  // @ts-expect-error — DUPLICATE_LAYER requires LayerId[], not string[]
  layersAction("DUPLICATE_LAYER", ["raw"]);
  // @ts-expect-error — unknown verb
  layersAction("UNKNOWN_VERB", [asLayerId("a")]);

  const designerAction = useDesignerAction();
  // @ts-expect-error — ZOOM_IN takes no payload
  designerAction("ZOOM_IN", 42);
}
