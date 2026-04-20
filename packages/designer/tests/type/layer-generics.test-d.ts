/**
 * Type-level tests for the generic `Layer<TType, TValue, TMeta>` shape.
 */

import type { Layer, LayerType } from "../../src/index.ts";
import { asLayerId } from "../../src/index.ts";

const id = asLayerId("layer-1");

// ── valid text layer: string value
const textLayer: Layer<"text", string> = {
  id,
  name: "Heading",
  type: "text",
  value: "Hello",
};

// ── valid custom layer: richer value
interface VideoValue {
  readonly src: string;
  readonly poster?: string;
}

const videoLayer: Layer<"video", VideoValue> = {
  id,
  name: "Clip",
  type: "video",
  value: { src: "https://example.com/a.mp4" },
};

const badValueType: Layer<"video", VideoValue> = {
  id,
  name: "Clip",
  type: "video",
  // @ts-expect-error — value must be VideoValue, not a string
  value: "a string, not a VideoValue",
};

// ── LayerType render receives the right value type
const videoType: LayerType<"video", VideoValue> = {
  type: "video",
  name: "Video",
  defaultValues: {
    name: "Video",
    value: { src: "" },
  },
  render: (layer) => {
    // layer.value is typed as VideoValue — these reads must compile.
    const src: string = layer.value.src;
    void src;
    return null;
  },
};
