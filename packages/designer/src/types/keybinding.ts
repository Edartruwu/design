/**
 * Keyboard shortcut binding.
 *
 * `key` is the canonical normalized key string (`cmd+d`, `shift+alt+r`, …).
 * Platform-specific display labels are provided via `label` / `labelMac`.
 * `group` lets UIs cluster related shortcuts in help overlays.
 */
export interface Keybinding {
  readonly key: string;
  readonly label: string;
  readonly labelMac: string;
  readonly description: string;
  readonly group: string;
}
