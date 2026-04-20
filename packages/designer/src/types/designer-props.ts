import type { ReactNode } from "react";
import type { FrameSize, SnapSettings } from "./frame.ts";
import type { Keybinding } from "./keybinding.ts";
import type { Layer, LayerType } from "./layer.ts";
import type { Mode } from "./tool.ts";
import type { Unit } from "./unit.ts";

/**
 * Fields common to both controlled and uncontrolled Designer instances.
 */
interface DesignerBaseProps {
  readonly children?: ReactNode;
  readonly className?: string;
  readonly layerTypes?: readonly LayerType[];
  readonly frameSize?: FrameSize;
  readonly unitSystem?: Unit;
  readonly dpi?: number;
  readonly mode?: Mode;
  readonly keybindings?: Readonly<Record<string, Keybinding>>;
  readonly debug?: boolean;
  readonly onMount?: () => void;
  readonly snap?: Partial<SnapSettings>;
  /**
   * Maximum number of undo/redo patch groups retained in memory. Older groups
   * are evicted (oldest-first) when the cap is reached. Default: 200.
   */
  readonly historyLimit?: number;
  /**
   * Idle window (ms) used to coalesce text-edit keystrokes into a single
   * history step. Default: 500.
   */
  readonly textBucketMs?: number;
  /**
   * If true, history is persisted to IndexedDB and restored on next mount.
   * Default: false.
   */
  readonly persistHistory?: boolean;
}

/**
 * Controlled mode: consumer owns `layers` state and mirrors updates via
 * `onLayersChange`. Must not pass `defaultLayers`.
 */
export interface DesignerControlledProps extends DesignerBaseProps {
  readonly layers: readonly Layer[];
  readonly onLayersChange: (layers: readonly Layer[]) => void;
  readonly defaultLayers?: never;
}

/**
 * Uncontrolled mode: Designer owns `layers` state internally. Consumers can
 * seed the initial state via `defaultLayers` and read the current snapshot
 * through `useLayers()`.
 */
export interface DesignerUncontrolledProps extends DesignerBaseProps {
  readonly defaultLayers?: readonly Layer[];
  readonly layers?: never;
  readonly onLayersChange?: never;
}

/**
 * Discriminated union so TS makes mixing controlled + uncontrolled props a
 * compile error, not a runtime warning.
 */
export type DesignerProps = DesignerControlledProps | DesignerUncontrolledProps;
