/**
 * Unit system.
 *
 * Values are stored with their native unit; the DPI is used to convert to
 * pixels at display / commit time. This avoids losing precision for
 * print-oriented documents that prefer mm / in / pt over px.
 */

export type Unit = "px" | "mm" | "in" | "cm" | "pt";

export interface ValueWithUnit {
  readonly value: number;
  readonly unit: Unit;
}

export const DEFAULT_DPI = 96 as const;

export const DPI_PRESETS = {
  screen: 96,
  retina: 192,
  print: 300,
  hiPrint: 600,
} as const satisfies Record<string, number>;

export type DpiPreset = keyof typeof DPI_PRESETS;
