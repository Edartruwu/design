## Roadmap

Here's a list of features we're working on:

- **Pages** - We're improving the API for working with multiple pages and multiple frames, especially history management.
- **Layers Grouping** - This is a feature we're testing out. We're not sure if we'll keep it.

---

## Changelog

## Restructured Docs, llms.txt, and Markdown

We've reorganized the docs and added support for LLMs and markdown.

### Docs

The docs are now split into four sections: **Concepts**, **Guides**, **Examples**, and **Reference**. Old URLs redirect automatically.

## v1.1.0

We just tagged `@shadcn/designer` v1.1.0 with a new unit system and unified Designer Tool API for managing canvas tools.

- [Unit System](#unit-system)
- [Designer Tool](#designer-tool)
- [Input Scrubber](#input-scrubber)

### Unit System

We now let you work in pixels, millimeters, inches, centimeters, or points with DPI-aware conversions.

- Introduced hooks for reacting to unit changes: `useUnitSystem`, `useSetUnitSystem`, `useDPI`, and `useSetDPI`.
- Added `ActionUnitSelector` for swapping units directly from the toolbar.
- Added a shared `units` library with helpers like `toPixels`, `fromPixels`, `parseValueWithUnit`, and `formatValue` plus `DEFAULT_DPI` and `DPI_PRESETS` presets.
- Updated editor defaults to store `unitSystem` and `dpi`, convert paper sizes from millimeters, and clamp dimension inputs at `0`.
- Refined dimension displays to show converted values with trimmed decimals and localized unit abbreviations.

```tsx
import { useUnitSystem, useSetUnitSystem } from "@shadcn/designer";

function UnitSwitcher() {
  const unitSystem = useUnitSystem();
  const setUnitSystem = useSetUnitSystem();

  return (
    <div className="flex items-center gap-2">
      <span>Units: {unitSystem}</span>
      <button onClick={() => setUnitSystem("mm")}>Millimeters</button>
    </div>
  );
}
```

### Example

This example demonstrates how to use the unit system to display and work with measurements in different units.

### Designer Tool

We've introduced a new tool selection system that allows you to switch between different interaction modes on the canvas. This release includes two core tools:

- **Move Tool (V)** - The default tool for selecting, moving, resizing, and rotating layers
- **Hand Tool (H)** - Pan around the canvas without selecting or moving layers

#### Hooks

**`useDesignerTool()`** - Get the currently active tool

```tsx
import { useDesignerTool } from "@shadcn/designer";

function ToolIndicator() {
  const tool = useDesignerTool();

  return <div>Active: {tool === "move" ? "Move Tool" : "Hand Tool"}</div>;
}
```

**`useSetDesignerTool()`** - Change the active tool programmatically

```tsx
import { useSetDesignerTool } from "@shadcn/designer";

function ToolSwitcher() {
  const setTool = useSetDesignerTool();

  return (
    <div>
      <button onClick={() => setTool("move")}>Move (V)</button>
      <button onClick={() => setTool("hand")}>Hand (H)</button>
    </div>
  );
}
```

#### ActionToolbarTool

Dropdown toolbar button for switching between tools

```tsx
import { ActionToolbarTool } from "@shadcn/designer";

<DesignerToolbar>
  <DesignerToolbarGroup>
    <ActionToolbarTool />
  </DesignerToolbarGroup>
</DesignerToolbar>;
```

See the [Hooks Reference](/docs/reference/hooks#usedesignertool) for complete API documentation.

#### Example

Use the Cursor and Hand buttons in the toolbar to switch between the move and hand tools.

### Input Scrubber

The [`InputGroup`](/docs/reference/ui#inputgroup) component now supports scrubbing for faster adjustments without losing precision.

- Hold the mouse button and drag to scrub an input value.
- Added a `useScrubber` hook that handles pointer locking, acceleration, and modifier shortcuts for fine or coarse adjustments.
- Exposed the hook through the designer entry point so custom controls can share the same interaction model as built-in actions.
- Bundled a visual scrubber cursor that renders while dragging to make state changes easier to track.

```tsx
import * as React from "react";
import { useScrubber } from "@shadcn/designer";

function DimensionScrubber() {
  const { scrubProps, value } = useScrubber({
    value: 120,
    onChange: (next) => console.log("Width", next),
  });

  return (
    <button className="flex items-center gap-2" {...scrubProps}>
      Width: {value}px
    </button>
  );
}
```

#### Continuous Button Press

We've added hold-to-repeat controls to make numeric inputs feel more responsive.

- Added a continuous press controller that emits repeated `onChange` events while increment or decrement buttons remain pressed.
- Integrated the behavior into `InputNumber`, matching keyboard repeat cadence and respecting min/max constraints.
- Tuned acceleration so long presses ramp quickly without overshooting small adjustments.

## v1.0.0

We're excited to announce the release of `@shadcn/designer` v1.0.0 (stable). If you do not have a license, you can get one [here](/docs/pricing).

![v1.0.0](/opengraph-image.jpg)

Here's a list of the new features and improvements:

- **mode** - new `mode` prop to the `<Designer />` component to switch between different layer modes. See the [docs](/docs/reference/designer#mode) for more information.
- **onMount** - We've added a new `onMount` prop to the `<Designer />` component to run a callback when the designer is mounted. Useful for doing additional setup when the designer is ready.
- **defaultLayers** - the `layers` prop has been renamed to `defaultLayers` for uncontrolled components.
- **layers** and **onLayersChange** - We've added new props for controlled `<Designer />` components.
- We've also introduced a layer signature optimization to reduce the number of re-renders.
- We've improved layer snapping to be more accurate.

See the [roadmap](/docs/roadmap) for what's coming next.

**Thank you to all the early adopters who have been using the designer and providing feedback: Mikkel, Sebastian, Piotr, Santosh, Jenny, Alex, Maria, David K., David E., and Sarah.**

## v0.4.0

We've released a new version of `@shadcn/designer` with several improvements to the image browser, a new image cropper and layer locking.

### Image Browser

![Image Browser](/images/pv3hRvKM.png)

The new `ActionImage` now has support for plugins. You can build your own image plugin and use it in the image browser.

```tsx
<ActionImage
  plugins={[
    {
      id: "cropper",
      label: "Crop",
      description:
        "Move and scale the image to crop it. The white frame represents the layer.",
      component: <ActionImageCropper />,
    },
    {
      id: "browser",
      label: "Browse",
      description:
        "Search and select an image to set as the image for the selected layer.",
      component: <ActionImageBrowser apiUrl="/api/images" />,
    },
  ]}
/>
```

See the [Image Browser](/docs/guides/image-browser) guide to learn how to build your own image browser plugin.

### Image Cropper

We've added a new `ActionImageCropper` component for image cropping.

![Image Cropper](/images/UGHEUXXN.png)

The `ActionImageCropper` can be used on its own or as a plugin for the `ActionImage` component.

### Locked Layers

We've also added a new `locked` property to layers. This allows you to lock a layer in place.

You can use the `layersAction("LOCK_UNLOCK_LAYER", [layer.id])` action to lock and unlock layers.

```tsx
import { useLayersAction } from "@shadcn/designer";

export function LockLayerButton({ layer }: { layer: DesignerLayer }) {
  const layersAction = useLayersAction();

  return (
    <Button onClick={() => layersAction("LOCK_UNLOCK_LAYER", [layer.id])}>
      {layer.isLocked ? <IconLock /> : <IconLockOpen />}
      <span className="sr-only">Toggle lock</span>
    </Button>
  );
}
```

## v0.3.0

We've released a new version of `@shadcn/designer` with several improvements to the core functionality and user experience.

### History API

We've implemented a new History API that allows you to undo and redo changes in your designs. The API is available through three new hooks:

```tsx
// Get access to the history state
const history = useHistory();

// Undo the last change
const undo = useUndo();

// Redo the last undone change
const redo = useRedo();
```

### Improvements

We've made several improvements to the canvas interaction:

- Added support for wheel and pinch zoom gestures
- Fixed adaptive zoom behavior for better viewport handling
- Resolved keyboard shortcut issues related to zoom controls
- Fixed layer update flickering issues for smoother rendering

### What's Next?

We are building more examples and documentation to help you, including image generation with AI. Stay tuned!

## v0.2.0

We just tagged a new release of `@shadcn/designer`. This release brings a lot of new features and improvements.

### Font Picker

We've added a Google Font picker to the designer.

The picker is decoupled from the designer so that you're free to implement your own picker or use the one we provide.

![Font Picker](/images/font-picker-light.png)
![Font Picker](/images/font-picker-dark.png)

### Image Browser

We've also added an image browser using the Unsplash API. Use this as a reference to build your own image picker.

![Image Browser](/images/image-browser-light.png)
![Image Browser](/images/image-browser-dark.png)

### Snapping

We've added snapping to the canvas. This means that layers will snap to the nearest grid point when you move them. This makes it easier to align layers to the canvas. We've also added distance guidelines for horizontal and vertical snapping.

![Snapping](/images/snapping-light.png)
![Snapping](/images/snapping-dark.png)

### Template Updates

- We've updated the template to use the new font picker and image browser.
- We added examples for fetching fonts and images from the Unsplash API.
- The template now ships with a _Playground_ to test image layers. This is the same playground that you see in the demo.
- We also added an _Inspector_ to test the static frame rendering. This is useful for turning posts into images.

That's it for now. Grab the [latest template](/docs#download-template) to see the new features. See the [Roadmap](/docs/roadmap) for what's coming next.

## v0.1.0

We are excited to bring you this update as we are getting close to General Availability (GA).

This update brings a lot of changes to the core system. We've added a new set of hooks and components to make it easier to extend and build custom designers.

There are still a few things we're wrapping up, but we're excited to finally show you a demo of what we've been working on.

### Designer Demo

First, let's take a look at a demo of what we've been working on. Click on Launch Demo in the header to create your own personalized playground to test the editor.

Use this playground to test the editor features, layers, controls and actions.

### API

We've also built a demo to show how you can turn any design into an API. Using the API turns your designs into templates that can be used to generate designs for different contexts by passing in different layer values.

[Try the API](https://ds.shadcn.com/demo/dito/j73pj2qqr6nwdrs7/api)

### Export to Image

When you're done customizing your layer values, click the Download button to download the design as an image.

![Export to Image](/images/bGL6tRkr.png)

This can be used to generate images for social media, banners, etc and serve them on demand over a CDN.

### Performance Improvements

We've made a lot of performance improvements.

We reworked the internal system to have better rendering performance. Updates are granular and only trigger when necessary. We also fixed an issue with dropped frames.

### Layer Types

You can now define your own layer types and override the default ones. A layer type can bring in its own keybindings, default values and render method.

```tsx
<Designer layerTypes={[
  {
    type: "custom",
    name: "Custom",
    icon: IconCustom,
    defaultValues: {
      // ...
    },
    keybinding: {
      // ...
    },
    render: (layer) => (
      // ...
    ),
  }
]} />
```

### Hooks

Every state and action are now available as hooks. We provide all the necessary hooks to read and update the state of the designer.

```tsx
// Get the layers.
const layers = useLayers();

// Set the zoom level
const designerAction = useDesignerAction();
designerAction("ZOOM_IN");

// Get the selected layers
const selectedLayers = useSelectedLayers();

// Change the name of a layers
const setLayersProperty = useSetLayersProperty();
setLayersProperty([ID_OF_LAYERS], "name", "New Name");
```

See the [reference](/docs/reference/hooks) for more information on available hooks.

### Frame Size

We've made the frame size customizable. You can now pass a `frameSize` prop to the `<Designer />` component to set the size of the frame. Useful for building social media images, banners, etc of different sizes.

```tsx
<Designer frameSize={{ width: 1024, height: 1024 }} />
```

To programmatically change the frame size, you can use the `setFrameSize` hook.

```tsx
const setFrameSize = useSetFrameSize();
setFrameSize({ width: 1024, height: 1920 });
```

### Keyboard Shortcuts

We've added a new `keybindings` prop to the `<Designer />` component to handle keyboard shortcuts. You can pass a `keybindings` object to the component to provide your own keybindings or override the default ones.

```tsx
<Designer
  keybindings={{
    DUPLICATE_LAYER: {
      key: "meta+d",
      label: "Ctrl D",
      labelMac: "⌘ D",
      description: "Duplicate selected layers",
      group: "Layer",
    },
  }}
/>
```

See the [reference](/docs/reference/keybindings) for more information on available keybindings.

### Debug Mode

We've also added a new `debug` prop to the `<Designer />` component to enable debug mode during development.

    Previous Releases

## v0.0.1

See the [latest documentation](/docs) for the most up-to-date information.

Based on your valuable feedback, we've completely rebuilt [Designer](https://ds.shadcn.com) from the ground up. We would like to share an early preview that introduces a new level of composability and flexibility.

We've redesigned the system to be highly composable while preserving flexibility. This means you can build a simple component designer to a full-fledged designer with drag-and-drop functionality.

We're working on more documentation and examples, but we want to share an early preview with you. You can install and try it today.

Let's get started.

### Project Setup

We've put together a template to get you started. The template is a simple Vite app with Tailwind CSS, shadcn/ui and Designer.

Download the template and extract it into your project folder.

```bash
cd studio && pnpm install
```

```bash
pnpm dev
```

If you visit [http://localhost:5173](http://localhost:5173), you should see a white page displaying "Hello World".

![Hello World](/images/01.png)

### Setup the Designer

We'll start by adding the `<Designer />` and `<DesignerCanvas />` components to our page.

Place the `<Designer />` and `<DesignerCanvas />` components in the `src/App.tsx` file.

This will setup the designer and an infinite canvas with zoom, pan and controls.

```tsx
import { Designer, DesignerCanvas } from "@shadcn/designer";

export default function App() {
  return (
    <Designer layers={[]}>
      <DesignerCanvas />
    </Designer>
  );
}
```

Every design starts with a frame. The frame is the container that holds your layers.

A frame has a width and height. Use a `<DesignerFrame>` component to set the size of your design. This can be any size you want eg. 1024x1024, 1920x1080, 2048x2048, etc.

Place the `<DesignerFrame>` component inside the `<DesignerCanvas>` component.

```tsx
import { Designer, DesignerCanvas, DesignerFrame } from "@shadcn/designer";

export default function App() {
  return (
    <Designer layers={[]}>
      <DesignerCanvas>
        <DesignerFrame width={1024} height={1024} />
      </DesignerCanvas>
    </Designer>
  );
}
```

![Designer with frame](/images/02.png)

### Add a Layer

Now that we have the basic setup, let's add a layer.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  type DesignerLayer,
} from "@shadcn/designer";

const layers: DesignerLayer[] = [
  {
    id: "1",
    name: "Heading",
    type: "text",
    value: "Hello World",
    style: {
      fontSize: "124px",
      fontWeight: "bold",
      width: "900px",
      height: "200px",
    },
  },
];

export default function App() {
  return (
    <Designer layers={layers}>
      <DesignerCanvas>
        <DesignerFrame width={1024} height={1024} />
      </DesignerCanvas>
    </Designer>
  );
}
```

This will add a `text` layer to the frame. You can click to drag the layer and use the resizer to change its width and height.

### Add an Action

An action is a component that can be used to display and transform the style of a layer. For example, you can use an action to change the width and height of a layer or the font size.

**@shadcn/designer** comes with a set of actions that you can use out of the box.

Let's add an action to change the dimension of a layer. We'll place it in a `<DesignerPanel>` component on the right side of the screen.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  type DesignerLayer,
  ActionDimension,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";

const layers: DesignerLayer[] = [
  {
    id: "1",
    name: "Heading",
    type: "text",
    value: "Hello World",
    style: {
      fontSize: "124px",
      fontWeight: "bold",
      width: "900px",
      height: "200px",
    },
  },
];

export default function App() {
  return (
    <Designer layers={layers}>
      <DesignerCanvas>
        <DesignerFrame width={1024} height={1024} />
      </DesignerCanvas>
      <DesignerPanel>
        <DesignerPane showForLayerTypes="all">
          <DesignerPaneTitle>Layer</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionDimension />
          </DesignerPaneContent>
        </DesignerPane>
      </DesignerPanel>
    </Designer>
  );
}
```

That was easy, right? Let's add more actions.

We'll add the `ActionPosition` and `ActionFill` actions to the panel.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  type DesignerLayer,
  ActionDimension,
  ActionPosition,
  ActionFill,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";

const layers: DesignerLayer[] = [
  {
    id: "1",
    name: "Heading",
    type: "text",
    value: "Hello World",
    style: {
      fontSize: "124px",
      fontWeight: "bold",
      width: "900px",
      height: "200px",
    },
  },
];

export default function App() {
  return (
    <Designer layers={layers}>
      <DesignerCanvas>
        <DesignerFrame width={1024} height={1024} />
      </DesignerCanvas>
      <DesignerPanel>
        <DesignerPane showForLayerTypes="all">
          <DesignerPaneTitle>Layer</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionDimension />
            <ActionPosition />
            <ActionFill />
          </DesignerPaneContent>
        </DesignerPane>
      </DesignerPanel>
    </Designer>
  );
}
```

Actions leverage the composable nature of the designer. This means you can add or remove actions and add multiple panels and panes to build custom designers.

### Add an Image Layer with Actions

Now, let's add an image layer to our frame. We'll also add an action to apply filters to the image.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  type DesignerLayer,
  ActionDimension,
  ActionPosition,
  ActionFill,
  ActionImageFit,
  ActionImageFilter,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";

const layers = [
  {
    id: "1",
    name: "Heading",
    type: "text",
    value: "Hello World",
    style: {
      fontSize: "124px",
      fontWeight: "bold",
      width: "900px",
      height: "200px",
    },
  },
  {
    id: "2",
    name: "Image",
    type: "image",
    value:
      "https://images.unsplash.com/photo-1474966862828-c58886978c8c?q=50&w=3284&auto=format",
    style: {
      width: "500px",
      height: "500px",
    },
  },
] satisfies DesignerLayer[];

export default function App() {
  return (
    <Designer layers={layers}>
      <DesignerCanvas>
        <DesignerFrame width={1000} height={1000} />
      </DesignerCanvas>
      <DesignerPanel>
        <DesignerPane showForLayerTypes="all">
          <DesignerPaneTitle>Text</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionDimension />
            <ActionPosition />
            <ActionFill />
          </DesignerPaneContent>
        </DesignerPane>
        <DesignerPane showForLayerTypes={["image"]}>
          <DesignerPaneTitle>Image</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionImageFit />
            <ActionImageFilter />
          </DesignerPaneContent>
        </DesignerPane>
      </DesignerPanel>
    </Designer>
  );
}
```

### Custom Actions

We also provide the necessary hooks and UI primitives to create your own actions.

Let's create an action to change the text alignment of a layer. We'll call it `ActionTextAlign`.

Place the following code in a `components/action-text-align.tsx` file.

```tsx
import { useDesignerAction } from "@shadcn/designer";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/designer/components";

export function ActionTextAlign() {
  const { value, updateLayers } = useDesignerAction({
    property: "textAlign",
    deserialize: (value) => value ?? "left",
    serialize: (value) => value ?? "left",
  });
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="text-align">Text align</Label>
      <Select value={value} onValueChange={(value) => updateLayers(value)}>
        <SelectTrigger id="text-align">
          <SelectValue placeholder="Select text align" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="right">Right</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

The code above uses the `useDesignerAction` hook to create an action. This hook provides the necessary state and methods to read (deserialize) and update (serialize) the layer style.

Add the `ActionTextAlign` component to the designer.

```tsx
import { ActionTextAlign } from "@/components/action-text-align";

export default function App() {
  return (
    <Designer layers={layers}>
      <DesignerCanvas>
        <DesignerFrame width={1000} height={1000} />
      </DesignerCanvas>
      <DesignerPanel>
        <DesignerPane showForLayerTypes="all">
          <DesignerPaneTitle>Text</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionDimension />
            <ActionPosition />
            <ActionFill />
            <ActionTextAlign />
          </DesignerPaneContent>
        </DesignerPane>
        <DesignerPane showForLayerTypes={["image"]}>
          <DesignerPaneTitle>Image</DesignerPaneTitle>
          <DesignerPaneContent>
            <ActionImageFit />
            <ActionImageFilter />
          </DesignerPaneContent>
        </DesignerPane>
      </DesignerPanel>
    </Designer>
  );
}
```

### What's Next?

That's it for now. In the next update, we'll ship designer presets where you can import a full-fledged designer with a predefined set of actions.

We're also working on more documentation and examples.

We'd love for you to try it out and give us feedback.

---

## Designer

Learn how to use the designer component.

The `Designer` component is the heart of the `@shadcn/designer` package. It gives you the canvas, frame, tooling, and data model you need to build custom editors, from a single framed artboard to a multi-pane design suite.

## Quick start

Use `Designer`, `DesignerContent`, `DesignerCanvas`, and `DesignerFrame` together to render the default editor experience. This mirrors the setup used in the basic example.

```tsx
import * as React from "react";
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
} from "@shadcn/designer";

export function CustomDesigner() {
  return (
    <Designer className="flex h-svh flex-col gap-4">
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

> **Tip:** `Designer` is layout agnostic. Wrap it inside your own flex or grid containers to create headers, panels, and footers around the canvas.

The `Designer` component currently targets a single frame workflow. Support for multiple frames is in development and will land soon.

## Layout primitives

- `DesignerContent` renders the scrollable workspace that holds the canvas.
- `DesignerCanvas` provides pan, zoom, and selection handling for all layers.
- `DesignerFrame` draws a transformable artboard. Add multiple frames or swap in `DesignerStaticFrame` when you want a fixed preview.
- `DesignerToolbar`, `DesignerPanel`, and `DesignerPane` help you compose custom UI around the canvas.

Combine these building blocks with your own UI from `@shadcn/ui` to design the editor shell that fits your product.

## Core props

| Prop             | Type                                             | Description                                                                                              |
| ---------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `defaultLayers`  | `Layer[]`                                        | Pre-populated layers for uncontrolled mode. Useful for seeding from persisted data.                      |
| `layers`         | `Layer[]`                                        | Enables controlled mode. Mirror state updates with `onLayersChange`.                                     |
| `onLayersChange` | `(layers: Layer[]) => void`                      | Called whenever the editor mutates layers. Required when `layers` is provided.                           |
| `layerTypes`     | `LayerType[]`                                    | Extends or replaces the default layer registry. Tie custom renderers and tooling to your data.           |
| `frameSize`      | `{ width: number; height: number; unit?: Unit }` | Sets the initial dimensions and unit for `DesignerFrame`. Combine with unit actions for print workflows. |
| `unitSystem`     | `Unit`                                           | Overrides the global unit (px, in, mm, etc.). Drives rulers, snapping, and measurement UI.               |
| `dpi`            | `number`                                         | Define dots per inch for pixel-to-unit conversions.                                                      |
| `mode`           | `"single"                                        | "multiple"`                                                                                              | Toggle between editing one layer at a time or multi-select workflows. |
| `keybindings`    | `Record<string, Keybinding>`                     | Customize shortcuts or provide localized variations.                                                     |
| `debug`          | `boolean`                                        | Surface debug visuals while developing integrations.                                                     |
| `onMount`        | `() => void`                                     | Run side effects (analytics, focus) after the editor mounts.                                             |

## Seeding layers in uncontrolled mode

`Designer` manages its own layer state when you pass `defaultLayers`. This is ideal when you only need to load an initial document.

```tsx
import * as React from "react";
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  type Layer,
} from "@shadcn/designer";

const DEFAULT_LAYERS: Layer[] = [
  {
    id: "layer-1",
    name: "Hero",
    type: "frame",
    value: null,
    cssVars: {
      "--width": "640px",
      "--height": "480px",
      "--background-color": "#dbeafe",
      "--translate-x": "80px",
      "--translate-y": "56px",
    },
  },
];

export function DesignerWithDefaults() {
  return (
    <Designer
      defaultLayers={DEFAULT_LAYERS}
      className="flex h-[720px] flex-col gap-4"
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Controlled mode

When you need to sync layers with your own state or a backend, switch to controlled mode by providing `layers` and `onLayersChange`.

```tsx
import * as React from "react";
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  type Layer,
} from "@shadcn/designer";

export function DesignerControlled() {
  const [layers, setLayers] = React.useState<Layer[]>([]);

  return (
    <Designer
      layers={layers}
      onLayersChange={setLayers}
      className="flex h-[720px] flex-col gap-4"
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Custom layer types

Augment the editor by extending `DEFAULT_LAYER_TYPES` with your own definition. Supply defaults, keyboard shortcuts, and a render function that outputs React nodes.

```tsx
import * as React from "react";
import {
  DEFAULT_LAYER_TYPES,
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  type LayerType,
} from "@shadcn/designer";
import { IconPlayerPlay } from "@tabler/icons-react";

const VIDEO_LAYER_TYPE = {
  type: "video",
  name: "Video",
  icon: IconPlayerPlay,
  defaultValues: {
    name: "Video",
    value: {
      src: "https://cdn.example.com/video.mp4",
    },
    cssVars: {
      "--width": "320px",
      "--height": "180px",
      "--background-color": "#000000",
    },
  },
  keybinding: {
    key: "v",
    label: "V",
    labelMac: "V",
    description: "Add video layer",
    group: "New Layer",
  },
  render: (layer) => {
    return <video controls style={layer.contentStyle} src={layer.value.src} />;
  },
} satisfies LayerType;

export function DesignerWithVideoLayer() {
  return (
    <Designer
      layerTypes={[...DEFAULT_LAYER_TYPES, VIDEO_LAYER_TYPE]}
      className="flex h-[720px] flex-col gap-4"
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Composing the UI

Add panels, toolbars, and inspector panes around the canvas to create a full editor experience.

```tsx
import * as React from "react";
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerHeader,
  DesignerPanel,
  DesignerToolbar,
  DesignerToolbarGroup,
  DesignerToolbarButton,
} from "@shadcn/designer";
import { Button } from "@shadcn/ui/button";

export function DesignerWithShell() {
  return (
    <Designer className="flex h-svh flex-col gap-4">
      <DesignerHeader className="flex items-center justify-between gap-2 p-4">
        <div className="text-sm font-medium">Brand Poster</div>
        <div className="flex gap-2">
          <Button size="sm">Preview</Button>
          <Button size="sm" variant="outline">
            Export
          </Button>
        </div>
      </DesignerHeader>

      <DesignerToolbar className="flex items-center gap-2 px-4">
        <DesignerToolbarGroup className="flex items-center gap-2">
          <DesignerToolbarButton size="sm">Add</DesignerToolbarButton>
          <DesignerToolbarButton size="sm">Duplicate</DesignerToolbarButton>
        </DesignerToolbarGroup>
      </DesignerToolbar>

      <div className="grid flex-1 grid-cols-[1fr_320px] gap-4">
        <DesignerContent>
          <DesignerCanvas>
            <DesignerFrame />
          </DesignerCanvas>
        </DesignerContent>

        <DesignerPanel className="flex flex-col gap-6 p-4">
          <div>
            <p className="text-sm font-semibold">Layer</p>
            <p className="text-sm text-muted-foreground">
              Select a layer to edit properties.
            </p>
          </div>
        </DesignerPanel>
      </div>
    </Designer>
  );
}
```

## Next steps

- Walk through [Layers](../layers) to learn how layer data, transforms, and inspectors work together.
- Dive into [Unit System](../unit-system) for precision control over print and physical products.
- Explore the `/examples` directory for more complete editor shells, including print and marketing templates.

---

## Layers

Learn how to work with layers and layer types in designer.

The designer is built with a flexible layer system that allows you to create custom layers. This guide will show you how to build and use your own layer types.

## Layer Type

A layer type in designer is an object that defines the properties of a layer and how it is rendered.

Here's the type definition for a layer type:

```tsx
type LayerType = {
  type: string;
  name: string;
  icon: ReactNode;
  defaultValues: Omit<Layer, "id" | "type">;
  render: (layer: LayerWithStyles) => React.ReactNode;
  keybinding?: Keybinding;
};
```

## Creating a Custom Layer

We'll create a new custom layer type called `shape`. It will be a circle shape that can be resized and rotated.

Create a new file called `src/layers/shape.tsx` and add the following code.

Let's start by defining the layer type.

```tsx
import { type LayerType } from "@shadcn/designer";
import { IconCircle } from "@tabler/icons-react";

export const shapeLayer = {
  type: "shape",
  name: "Shape",
  icon: <IconCircle />,
  defaultValues: {
    name: "Shape",
    value: "circle",
    cssVars: {
      "--width": "100px",
      "--height": "100px",
      "--background-color": "#000000",
      "--border-radius": "50%",
    },
  },
  keybinding: {
    key: "s",
    label: "S",
    labelMac: "S",
    description: "Add Shape",
    group: "New Layer",
  },
  render: (layer) => {
    return (
      <div
        style={{
          aspectRatio: "1/1",
          ...layer.contentStyle,
        }}
      />
    );
  },
} satisfies LayerType;
```

The `shapeLayer` is a custom layer type that can be used in the designer. It has a `type` of `shape`, a `name` of `Shape`, an icon of a circle, a default value of a circle, a keybinding of `s` for `Shape`, and a render function that renders a div with the content style.

We have set the default value of the layer to a circle.

## Using Custom Layers

To use your custom layer, you need to **extend** the default layer types and pass them to the `Designer` component:

Extending the default layer types ensures you can add, remove and override existing layer types easily.

```tsx
import { Designer, DEFAULT_LAYER_TYPES } from "@shadcn/designer";
import { shapeLayer } from "./layers/shape";

function MyDesigner() {
  // Extend the default layer types with your custom layer
  const layerTypes = [...DEFAULT_LAYER_TYPES, shapeLayer];

  return (
    <Designer layerTypes={layerTypes}>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

The designer will take care of automatically adding the new layer type, handle rendering, keyboard shortcuts, and more. If you provide an icon, it will also show up in the `<DesignerToolbar />`.

Click on the circle icon in the toolbar to add a new shape layer to the canvas. You can also press S on your keyboard to add a new shape layer.

## Best Practices

1. **Unique Type**: Always use a unique `type` identifier for your layer.
2. **Default Values**: Provide sensible default values for the layer name, value, and CSS variables.
3. **Keyboard Shortcuts**: Add keyboard shortcuts for better user experience.
4. **Rendering**: Ensure you use the `layer.contentStyle` to style the layer.

Remember to test your layers thoroughly with the designer's transformation tools.

## Custom Layer Action

Now that we have a custom layer, let's add a custom action to the layer. We'll add a custom action to change the color of the shape.

Let's create a `ActionShapeColor` component inside `src/actions/shape-color.tsx` and add the following code.

```tsx
import { Action, ActionControls, ActionLabel } from "@shadcn/designer/ui";

export function ActionShapeColor() {
  return (
    <Action>
      <ActionLabel>Color</ActionLabel>
      <ActionControls>// Control here.</ActionControls>
    </Action>
  );
}
```

To change the color of the shape, we use the CSS variable `--background-color`. The designer package provides two functions to help us create a custom action to change the color of the shape: `createLayerCssVarAction` and `useLayerCssVarAction`.

```tsx
import { Action, ActionControls, ActionLabel } from "@shadcn/designer/ui";
import {
  createLayerCssVarAction,
  useLayerCssVarAction,
} from "@shadcn/designer";

const backgroundColor = createLayerCssVarAction(
  "--background-color",
  "#000000",
);

export function ActionShapeColor() {
  const [value, setValue] = useLayerCssVarAction(backgroundColor);

  return (
    <Action>
      <ActionLabel>Color</ActionLabel>
      <ActionControls>
        <button onClick={() => setValue("#ff0000")}>Red</button>
      </ActionControls>
    </Action>
  );
}
```

Import the `ActionShapeColor` component into your `src/App.tsx` file and add the `ActionShapeColor` component to the `<DesignerPane />` with the `showForLayerTypes` prop set to `["shape"]`.

We use the `showForLayerTypes` prop to only show the pane when shape layers are selected.

> If you're following along from the Installation guide, add the code to the `<PanelRight />` component in `src/panel-right.tsx` file.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

import { ActionShapeColor } from "./actions/shape-color";

export default function App() {
  return (
    <Designer>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel>
          <DesignerPane showForLayerTypes={["shape"]}>
            <DesignerPaneTitle>Shape</DesignerPaneTitle>
            <DesignerPaneContent>
              <ActionShapeColor />
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerContent>
    </Designer>
  );
}
```

Add a new `Shape` layer to the canvas by clicking on the circle icon in the toolbar. You should see a new Color action in the right panel. Click on the Red button to change the color of the shape to red.

If you add more than one shape layer to the canvas, you can drag to select multiple layers and change the color of all of them at once.

## Next Steps

- See the [Custom Layers](/docs/examples/layer-custom) section for more examples of custom layers with complex actions and controls.
- Learn how to [use the theme system](/docs/concepts/theming) to customize the designer's appearance.
- Learn how to [use the unit system](/docs/concepts/unit-system).
- Learn more about the [designer components](/docs/reference/designer) and [hooks](/docs/reference/hooks).

---

## Theming

Add custom themes to your designer.

We use the [shadcn/ui](https://ui.shadcn.com/docs/theming) theming system to style the designer. You can bring in your own theme using CSS variables.

**Use the `-ds` prefix for all CSS variables.**

Add the following CSS variables to your `index.css` file. Update the values to match your theme.

```css
@import "tailwindcss";

:root {
  --ds-radius: 0.625rem;
  --ds-background: oklch(1 0 0);
  --ds-foreground: oklch(0.145 0 0);
  --ds-card: oklch(1 0 0);
  --ds-card-foreground: oklch(0.145 0 0);
  --ds-popover: oklch(1 0 0);
  --ds-popover-foreground: oklch(0.145 0 0);
  --ds-primary: oklch(0.205 0 0);
  --ds-primary-foreground: oklch(0.985 0 0);
  --ds-muted: oklch(0.97 0 0);
  --ds-muted-foreground: oklch(0.556 0 0);
  --ds-accent: oklch(0.97 0 0);
  --ds-accent-foreground: oklch(0.205 0 0);
  --ds-destructive: oklch(0.577 0.245 27.325);
  --ds-border: oklch(0.922 0 0);
  --ds-input: oklch(0.97 0 0);
  --ds-ring: oklch(0.708 0 0);
}

.dark {
  --ds-background: oklch(0.145 0 0);
  --ds-foreground: oklch(0.985 0 0);
  --ds-card: oklch(0.205 0 0);
  --ds-card-foreground: oklch(0.985 0 0);
  --ds-popover: oklch(0.269 0 0);
  --ds-popover-foreground: oklch(0.985 0 0);
  --ds-primary: oklch(0.922 0 0);
  --ds-primary-foreground: oklch(0.205 0 0);
  --ds-muted: oklch(0.269 0 0);
  --ds-muted-foreground: oklch(0.708 0 0);
  --ds-accent: oklch(0.371 0 0);
  --ds-accent-foreground: oklch(0.985 0 0);
  --ds-destructive: oklch(0.704 0.191 22.216);
  --ds-border: oklch(1 0 0 / 10%);
  --ds-input: oklch(1 0 0 / 15%);
  --ds-ring: oklch(0.556 0 0);
}
```

---

## Unit System

Work with multiple measurement units including pixels, millimeters, inches, centimeters, and points for both print and digital design workflows.

The Designer package includes a comprehensive unit system that supports multiple measurement scales beyond pixels. This allows you to work in your preferred units, whether designing for print (mm, inches) or digital (pixels, points), while maintaining precision and consistency throughout the design process.

## Supported Units

| Unit        | Symbol | Description                    | Common Use Case      |
| ----------- | ------ | ------------------------------ | -------------------- |
| Pixels      | `px`   | Screen pixels                  | Web design, UI       |
| Millimeters | `mm`   | Metric measurement             | Print design, Europe |
| Inches      | `in`   | Imperial measurement           | Print design, US     |
| Centimeters | `cm`   | Metric measurement             | Large print formats  |
| Points      | `pt`   | Typographic points (1/72 inch) | Typography, print    |

## Key Features

- **Native Unit Storage**: Values are stored with their original units (e.g., "100mm") ensuring exports maintain correct measurements.
- **DPI-Aware Conversion**: Supports different DPI settings for screen (96 DPI) and print (300 DPI) contexts.
- **Backwards Compatible**: Existing pixel-based designs continue to work without modification.
- **Real-time Conversion**: Switch between units on the fly with automatic conversion.
- **Precision**: All converted values use appropriate decimal places for clean display.

## Basic Setup

Configure the Designer component with your preferred units:

```tsx
import { Designer } from "@shadcn/designer";

function PrintDesigner() {
  return (
    <Designer
      // Frame size in millimeters
      frameSize={{ width: 210, height: 297, unit: "mm" }}
      // Display values in millimeters
      unitSystem="mm"
      // High DPI for print
      dpi={300}
      defaultLayers={[]}
    >
      {/* Designer content */}
    </Designer>
  );
}
```

## Frame Size with Units

The `frameSize` prop now accepts an optional `unit` field:

```tsx
// A4 paper in millimeters
frameSize={{ width: 210, height: 297, unit: "mm" }}

// US Letter in inches
frameSize={{ width: 8.5, height: 11, unit: "in" }}

// Screen size in pixels (default)
frameSize={{ width: 1920, height: 1080 }} // unit defaults to "px"
```

## Hooks

### useUnitSystem

Returns the current unit system being used for display.

```tsx
import { useUnitSystem } from "@shadcn/designer";

function MyComponent() {
  const unitSystem = useUnitSystem(); // "px" | "mm" | "in" | "cm" | "pt"

  return <div>Current unit: {unitSystem}</div>;
}
```

### useSetUnitSystem

Sets the unit system for displaying values.

```tsx
import { useSetUnitSystem } from "@shadcn/designer";

function UnitSwitcher() {
  const setUnitSystem = useSetUnitSystem();

  return (
    <button onClick={() => setUnitSystem("mm")}>Switch to Millimeters</button>
  );
}
```

### useDPI

Returns the current DPI setting.

```tsx
import { useDPI } from "@shadcn/designer";

function DPIDisplay() {
  const dpi = useDPI(); // Default: 96

  return <div>Current DPI: {dpi}</div>;
}
```

### useSetDPI

Sets the DPI for unit conversions.

```tsx
import { useSetDPI } from "@shadcn/designer";

function DPISwitcher() {
  const setDPI = useSetDPI();

  return (
    <select onChange={(e) => setDPI(Number(e.target.value))}>
      <option value="96">Screen (96 DPI)</option>
      <option value="300">Print (300 DPI)</option>
    </select>
  );
}
```

## Utility Functions

All unit utility functions are available from `@shadcn/designer/utils`:

### toPixels

Converts any unit value to pixels.

```tsx
import { toPixels } from "@shadcn/designer/utils";

// Convert 25.4mm to pixels at 96 DPI
const dpi = 96;
const pixels = toPixels(25.4, "mm", dpi); // 96 pixels (1 inch)

// Convert 72 points to pixels at 96 DPI
const pixels2 = toPixels(72, "pt", dpi); // 96 pixels
```

### fromPixels

Converts pixels to a target unit.

```tsx
import { fromPixels } from "@shadcn/designer/utils";

// Convert 96 pixels to millimeters at 96 DPI
const dpi = 96;
const mm = fromPixels(96, "mm", dpi); // 25.4mm

// Convert 300 pixels to inches at 300 DPI
const printDpi = 300;
const inches = fromPixels(300, "in", printDpi); // 1 inch
```

### convertUnit

Converts a value from one unit to another.

```tsx
import { convertUnit } from "@shadcn/designer/utils";

// Convert 100mm to inches at 300 DPI
const printDpi = 300;
const inches = convertUnit(100, "mm", "in", printDpi); // ~3.94 inches

// Convert 2 inches to pixels at 96 DPI
const screenDpi = 96;
const pixels = convertUnit(2, "in", "px", screenDpi); // 192 pixels
```

### parseValueWithUnit

Parses a string value with unit into its components.

```tsx
import { parseValueWithUnit } from "@shadcn/designer/utils";

const parsed = parseValueWithUnit("100mm");
// Returns: { value: 100, unit: "mm" }

const parsed2 = parseValueWithUnit("2.5in");
// Returns: { value: 2.5, unit: "in" }

// Numbers without units default to pixels
const parsed3 = parseValueWithUnit("200");
// Returns: { value: 200, unit: "px" }
```

### Additional Utilities

```tsx
import {
  valueToPixels, // Convert "100mm" string to pixels
  pixelsToValue, // Convert pixels to "100mm" string
  formatValue, // Format with appropriate precision
  getUnitDisplayName, // Get full name ("Millimeters")
  getUnitShortName, // Get abbreviation ("mm")
  roundForUnit, // Round to unit's precision
  DEFAULT_DPI, // 96 (CSS standard)
  DPI_PRESETS, // { screen: 96, print: 300, retina: 192 }
} from "@shadcn/designer/utils";
```

## Unit Selector Component

Add a unit selector to your toolbar for easy switching:

```tsx
import {
  ActionUnitSelector,
  DesignerToolbar,
  DesignerToolbarGroup,
} from "@shadcn/designer";

function MyToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <ActionUnitSelector />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

## Layer Storage

Layers store values with their original units, preserving precision:

```tsx
const layer: Layer = {
  id: "1",
  name: "Business Card",
  type: "frame",
  value: "",
  cssVars: {
    // Dimensions in millimeters
    "--width": "85mm",
    "--height": "55mm",
    "--translate-x": "10mm",
    "--translate-y": "10mm",

    // Border in points
    "--border-width": "1pt",

    // Font size in points
    "--content-font-size": "12pt",

    // Mixed units are supported
    "--padding-top": "5mm",
    "--margin-left": "0.25in",
  },
};
```

### Automatic Conversion

When switching units, values are converted for display but stored in their original units:

1. Layer stores: `"--width": "100mm"`
2. User switches to inches
3. Display shows: 3.94"
4. Internally still stored as: "100mm"
5. Export preserves: "100mm"

## Understanding DPI

DPI (Dots Per Inch) affects how physical units convert to pixels:

- **96 DPI** (Screen): 1 inch = 96 pixels (CSS standard)
- **300 DPI** (Print): 1 inch = 300 pixels (print quality)

### Conversion Examples

```tsx
// At 96 DPI (screen)
const screenDpi = 96;
toPixels(1, "in", screenDpi); // 96px
toPixels(25.4, "mm", screenDpi); // 96px (25.4mm = 1 inch)

// At 300 DPI (print)
const printDpi = 300;
toPixels(1, "in", printDpi); // 300px
toPixels(25.4, "mm", printDpi); // 300px
```

## Precision and Rounding

All unit conversions use appropriate precision for clean display:

- **Pixels**: Always rounded to integers
- **Points**: 1 decimal place
- **Millimeters/Centimeters/Inches**: 2 decimal places

This ensures values like "100.00mm" display as "100mm" while maintaining precision where needed.

## Dynamic Unit Switching

```tsx
"use client";

import { useState } from "react";
import { Designer } from "@shadcn/designer";
import type { Unit } from "@shadcn/designer/utils";

function DesignerWithUnitToggle() {
  const [unitSystem, setUnitSystem] = useState<Unit>("px");
  const [dpi, setDPI] = useState(96);

  return (
    <div>
      <div className="controls">
        <select
          value={unitSystem}
          onChange={(e) => setUnitSystem(e.target.value as Unit)}
        >
          <option value="px">Pixels</option>
          <option value="mm">Millimeters</option>
          <option value="in">Inches</option>
        </select>

        <select value={dpi} onChange={(e) => setDPI(Number(e.target.value))}>
          <option value="96">Screen (96 DPI)</option>
          <option value="300">Print (300 DPI)</option>
        </select>
      </div>

      <Designer unitSystem={unitSystem} dpi={dpi} defaultLayers={[]}>
        {/* Designer content */}
      </Designer>
    </div>
  );
}
```

## Migration Guide

### For Existing Projects

Existing projects using pixels will continue to work without any changes:

1. **No Breaking Changes**: All existing pixel-based layers work as before
2. **Optional Upgrade**: Add unit support when needed
3. **Gradual Migration**: Mix pixel and unit-based layers

### Adding Unit Support

To add unit support to an existing project:

```tsx
// Before (pixels only)
<Designer defaultLayers={layers}>
  {/* content */}
</Designer>

// After (with unit support)
<Designer
  defaultLayers={layers}
  unitSystem="px"  // Start with pixels
  dpi={96}          // Screen DPI
>
  <DesignerHeader>
    <ActionUnitSelector /> {/* Add unit switcher */}
  </DesignerHeader>
  {/* content */}
</Designer>
```

### Converting Existing Layers

To convert existing pixel values to units:

```tsx
import { pixelsToValue } from "@shadcn/designer/utils";

// Convert existing pixel layer to use millimeters
const dpi = 96;
const convertedLayer = {
  ...existingLayer,
  cssVars: {
    ...existingLayer.cssVars,
    // Convert 400px to mm at 96 DPI
    "--width": pixelsToValue(400, "mm", dpi), // "105.83mm"
    "--height": pixelsToValue(300, "mm", dpi), // "79.38mm"
  },
};
```

## Best Practices

1. **Choose Appropriate Units**: Use mm/inches for print, pixels for web
2. **Set Correct DPI**: 96 for screen, 300+ for print
3. **Store Native Units**: Let layers store their original units
4. **Consistent Units**: Use the same unit type within a design
5. **Test Exports**: Verify exported values maintain correct units

## Troubleshooting

### Common Issues

**Q: Why do my values change when switching units?**

A: Values are converted for display but stored in original units. The visual change is expected.

**Q: How do I ensure accurate print dimensions?**

A: Use the appropriate DPI (300+) and native print units (mm/inches).

**Q: Can I mix different units in one design?**

A: Yes, each layer property can use different units as needed.

**Q: What happens to units when exporting?**

A: Exported values maintain their original units without conversion.

## API Reference

### Types

```tsx
type Unit = "px" | "mm" | "in" | "cm" | "pt";

interface ValueWithUnit {
  value: number;
  unit: Unit;
}

interface FrameSize {
  width: number;
  height: number;
  unit?: Unit; // Optional, defaults to "px"
}
```

### Constants

```tsx
const DEFAULT_DPI = 96;

const DPI_PRESETS = {
  screen: 96,
  print: 300,
  retina: 192,
};
```

## Supported Dimension Properties

The following CSS variable properties automatically convert between units:

- Position: `--translate-x`, `--translate-y`
- Size: `--width`, `--height`
- Spacing: `--padding-*`, `--margin-*`
- Border: `--border-*-width`, `--border-*-radius`
- Typography: `--font-size`, `--letter-spacing`, `--line-height`
- Effects: `--box-shadow-*`, `--text-shadow-*`, `--filter-blur`
- Content variants: `--content-font-size`, `--content-letter-spacing`, etc.

---

## All Examples

See all examples of how to use the designer.

We have put together a few examples to help you get started with the designer. The examples cover a range of use cases and can be used as a starting point for your own projects.

---

## Basic Editor

A simple editor with a frame.

This is an example showing a basic editor with a frame inside a canvas. It has one `frame` layer.

> **Try it out:** Use your mouse to navigate, pan and zoom the canvas. Click on the blue frame to interact with it: move, resize, and rotate to see the editor in action.

## Components

We compose our custom editor using the following components:

- `Designer` to render the editor.
- `DesignerContent` as the container for the canvas and frame.
- `DesignerCanvas` for the infinite scrollable canvas.
- `DesignerFrame` to render the frame. By default, it's a 1024x1024px square.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
} from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

You can **create anything** from simple editors with just a frame to complex editors with headers, panels, toolbars, and more advanced features.

## Layer Types

The `Designer` includes **three built-in layer types**: `text`, `image`, and `frame`.

You can add **custom layer types** and remove the default ones using the `layerTypes` prop.

```tsx
import { DEFAULT_LAYER_TYPES, type LayerType } from "@shadcn/designer";

// Extends the default layer types with a custom video layer type.
const CUSTOM_LAYER_TYPES = [
  ...DEFAULT_LAYER_TYPES,
  {
    id: "video",
    name: "Video",
    // ... other props
  },
] satisfies LayerType[];

function CustomDesigner() {
  return (
    <Designer layerTypes={CUSTOM_LAYER_TYPES}>
      <DesignerContent />
    </Designer>
  );
}
```

## Working with Layers

The `Designer` component accepts a `defaultLayers` prop. It's an array of layers.

Use the `defaultLayers` prop to add default layers to the editor for example, layers loaded from a database.

```tsx
function CustomDesigner() {
  return (
    <Designer
      defaultLayers={[
        {
          id: "1",
          type: "text",
          name: "Layer 1",
          value: "",
          cssVars: {
            "--background-color": "#54a0ff",
            "--width": "400px",
            "--height": "400px",
            "--translate-x": "50px",
            "--translate-y": "50px",
          },
        },
      ]}
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Controlled Mode

The `Designer` component can be used in **controlled mode** by passing a `layers` and `onLayersChange` props.

```tsx
function CustomDesigner() {
  const [layers, setLayers] = useState<Layer[]>([]);

  return (
    <Designer layers={layers} onLayersChange={setLayers}>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

---

## Header

Add a header to the designer.

Use the `DesignerHeader` component to add a header to the designer.

The header is placed at the top of the designer and can contain custom component such as your logo, a search bar or editor controls.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerHeader,
} from "@shadcn/designer";
import { Button } from "@shadcn/designer/ui";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader>
        <span className="font-black text-foreground text-lg">studio</span>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">Button</Button>
          <Button variant="primary">Button</Button>
        </div>
      </DesignerHeader>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Custom Header

Use the `className` prop to customize the header. For example, you can make it floating by adding `m-4 w-auto rounded-full border-0 shadow`.

```tsx
function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader className="m-4 w-auto rounded-full border-0 shadow">
        <span className="font-black text-foreground text-lg">studio</span>
        <div className="ml-auto flex items-center gap-2">
          <ActionToolbarZoom />
        </div>
      </DesignerHeader>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

---

## Panels

Add left and right panels to the designer.

You can have left and right panels by placing the `DesignerPanel` components before and after the `DesignerCanvas` component.

```tsx
<Designer>
  <DesignerContent>
    <DesignerPanel>Left Panel</DesignerPanel>
    <DesignerCanvas />
    <DesignerPanel>Right Panel</DesignerPanel>
  </DesignerContent>
</Designer>
```

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerPanel,
} from "@shadcn/designer";

export function CustomDesigner() {
  return (
    <Designer>
      <DesignerContent>
        <DesignerPanel>
          <div className="p-4 text-xs">Left Panel</div>
        </DesignerPanel>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel>
          <div className="p-4 text-xs">Right Panel</div>
        </DesignerPanel>
      </DesignerContent>
    </Designer>
  );
}
```

---

## Panes

Add panes to the designer.

Use the `DesignerPane` component inside `DesignerPanel` to add panes to the designer.

A `DesignerPane` is a container for layer actions and controls. You can stack multiple panes inside a panel.

> **Try it out:** Click on _Hello World_ to select the text layer then use the _Font_ pane to edit it.

```tsx
"use client";

import {
  ActionColor,
  ActionFontStyle,
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerPane,
  DesignerPaneContent,
  DesignerPaneTitle,
  DesignerPanel,
} from "@shadcn/designer";

export function CustomDesigner() {
  return (
    <Designer
      defaultLayers={[
        {
          id: "layer-1",
          type: "text",
          name: "Text",
          value: "Hello World",
          cssVars: {
            "--content-font-size": "64px",
            "--content-font-weight": "700",
            "--content-color": "#000000",
            "--width": "400px",
            "--text-align": "center",
            "--height": "100px",
            "--translate-x": "300px",
            "--translate-y": "450px",
          },
        },
      ]}
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel>
          <div className="p-4 pb-0 text-muted-foreground text-xs">
            Right Panel
          </div>
          <DesignerPane showForLayerTypes={["text"]}>
            <DesignerPaneTitle>Font</DesignerPaneTitle>
            <DesignerPaneContent>
              <ActionColor />
              <ActionFontStyle />
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerContent>
    </Designer>
  );
}
```

---

## Toolbar

Add a toolbar to the designer.

You can use the `Toolbar` component to add a toolbar to the designer.

A toolbar is a container for toolbar buttons such as add layer, zoom, etc. You can group buttons together using the `DesignerToolbarGroup` component.

```tsx
import {
  ActionToolbarAddLayer,
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarButton,
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
} from "@shadcn/designer";
import { IconPlus } from "@tabler/icons-react";
import { toast } from "sonner";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
        <DesignerToolbarSeparator />
        <DesignerToolbarGroup>
          <DesignerToolbarButton
            tooltip="Custom Button"
            variant="default"
            onClick={() => toast("Custom Button Clicked")}
          >
            <IconPlus /> Button
          </DesignerToolbarButton>
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

## Toolbar Components

Use `DesignerToolbarGroup` to group toolbar buttons and `DesignerToolbarSeparator` to add a separator between groups.

```tsx
import {
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
} from "@shadcn/designer";

function CustomToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <DesignerToolbarButton />
        <DesignerToolbarButton />
      </DesignerToolbarGroup>
      <DesignerToolbarSeparator />
      <DesignerToolbarGroup>
        <DesignerToolbarButton />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

You can use `DesignerToolbarButton` to add a button to the toolbar.

```tsx
import { DesignerToolbarButton } from "@shadcn/designer";

function CustomToolbarButton() {
  return (
    <DesignerToolbarButton
      tooltip="Custom Button"
      onClick={() => toast("Custom Button Clicked")}
    >
      <IconPlus />
    </DesignerToolbarButton>
  );
}
```

---

## Custom Toolbar

Build a custom toolbar for the designer.

Compose your components inside the `DesignerToolbar` component to create a custom toolbar.

- Use the `DesignerToolbarGroup` component to group your components and `DesignerToolbarSeparator` to add a separator between your components.
- For toolbar buttons, use the `DesignerToolbarButton` component.

```tsx
import {
  ActionToolbarZoom,
  DesignerToolbar,
  DesignerToolbarButton,
  DesignerToolbarGroup,
  DesignerToolbarSeparator,
  createLayerCssVarAction,
  useLayerCssVarAction,
} from "@shadcn/designer"
import { IconCheck } from "@tabler/icons-react"

const backgroundColorAction = createLayerCssVarAction(
  "--background-color",
  "#3b82f6"
)

export function CustomToolbar() {
  const [backgroundColor, setBackgroundColor] = useLayerCssVarAction(
    backgroundColorAction
  )

  return (
    <DesignerToolbarGroup className="gap-1">
      {["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6"].map(
        (color) => (
          <DesignerToolbarButton
            data-active={backgroundColor === color}
            key={color}
            onClick={() => setBackgroundColor(color)}
            className="rounded-md bg-(--color) hover:bg-(--color) data-[active=true]:*:[svg]:opacity-100"
            tooltip={color}
            style={
              {
                "--color": color,
              } as React.CSSProperties
            }
          >
            <span className="sr-only">{color}</span>
            <IconCheck className="text-white opacity-0" />
          </DesignerToolbarButton>
        )
      )}
    </DesignerToolbarGroup>
    <DesignerToolbarSeparator />
    <DesignerToolbarGroup>
      <ActionToolbarZoom />
    </DesignerToolbarGroup>
  </DesignerToolbar>
  )
}
```

---

## Print & PDF

A print-ready editor with PDF export and paper size controls.

This example demonstrates a print-ready editor with support for standard paper sizes, orientations, DPI settings, and PDF export functionality.

> **Try it out:** Select a paper size and orientation, add text and images, then download your design as a high-quality PDF. Use the unit selector to work in pixels, millimeters, centimeters, inches, or points.

## Overview

The Print & PDF example showcases how to build a print-ready design editor with:

- Standard paper sizes (A4, A3, Letter, Legal, Tabloid)
- Portrait and landscape orientations
- DPI selection for print quality (96, 150, 300, 600 DPI)
- Multiple unit systems (px, mm, cm, in, pt)
- PDF export functionality
- Print-optimized canvas bounds

## Components

The editor uses a tabbed interface with two main sections:

- **Style Tab** - Layer styling controls for position, size, colors, typography, and more
- **Document Tab** - Paper size and orientation settings

This shows how to use your own custom components inside the designer to build advanced designer panels and toolbars.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerPanel,
  DesignerToolbar,
  useSetFrameSize,
  useDPI,
  useSetDPI,
  useUnitSystem,
  useSetUnitSystem,
} from "@shadcn/designer";

function PrintEditor() {
  return (
    <Designer frameSize={{ width: 2480, height: 3508 }} dpi={300}>
      <DesignerContent>
        <DesignerPanel className="invisible" />
        <DesignerCanvas>
          <DesignerFrame
            bounds={{
              left: 64,
              top: 64,
              right: 64,
              bottom: 64,
              position: "css",
            }}
            showBounds
          />
        </DesignerCanvas>
        <DesignerPanel>{/* Style and document controls */}</DesignerPanel>
      </DesignerContent>
      <DesignerToolbar>
        {/* Toolbar with unit, DPI, and export controls */}
      </DesignerToolbar>
    </Designer>
  );
}
```

## Unit System

The example supports multiple unit systems for precise print design.

For a detailed guide on working with unit systems, see the [Unit System](/docs/examples/unit-system) example.

```tsx
import { useUnitSystem, useSetUnitSystem } from "@shadcn/designer";

function UnitSelector() {
  const unitSystem = useUnitSystem();
  const setUnitSystem = useSetUnitSystem();

  return (
    <Select value={unitSystem} onValueChange={setUnitSystem}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="px">Pixels (px)</SelectItem>
        <SelectItem value="mm">Millimeters (mm)</SelectItem>
        <SelectItem value="cm">Centimeters (cm)</SelectItem>
        <SelectItem value="in">Inches (in)</SelectItem>
        <SelectItem value="pt">Points (pt)</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## DPI Settings

Control the resolution of your print design with DPI selection:

```tsx
import { useDPI, useSetDPI } from "@shadcn/designer";

function DPISelector() {
  const dpi = useDPI();
  const setDPI = useSetDPI();

  return (
    <Select value={String(dpi)} onValueChange={(v) => setDPI(Number(v))}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="96">96 DPI</SelectItem>
        <SelectItem value="150">150 DPI</SelectItem>
        <SelectItem value="300">300 DPI</SelectItem>
        <SelectItem value="600">600 DPI</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## Print Bounds

The example uses `bounds` prop to define safe print margins:

```tsx
<DesignerFrame
  bounds={{
    left: 64,
    top: 64,
    right: 64,
    bottom: 64,
    position: "css",
  }}
  showBounds
/>
```

This ensures content stays within printable areas by showing visual guides at the specified margins.

## PDF Export

To export to PDF, we use the [`DesignerStaticFrame`](/docs/reference/designer#designerstaticframe) component to render a static, [read-only version](/docs/examples/read-only) of the layers.

Then we use the [`mql`](https://microlink.io/) package to generate a PDF of the static frame.

---

## Unit System

Work with different measurement units like pixels, mm, cm, in, and pt.

This example demonstrates how to use the unit system to display and work with measurements in different units.

> **Try it out:** Use the unit selector in the toolbar to switch between pixels (px), millimeters (mm), centimeters (cm), inches (in), and points (pt). Notice how the layer dimensions update in real-time. Change the DPI to see how it affects physical unit conversions.

## Overview

The Designer supports multiple unit systems, making it ideal for both screen and print design work.

See the [Print & PDF](/docs/examples/print) example for a complete print-ready editor that uses unit systems.

- **Pixels (px)** - For screen-based designs
- **Millimeters (mm)** - Common for print design in metric countries
- **Centimeters (cm)** - Larger metric measurements
- **Inches (in)** - Standard for print design in the US
- **Points (pt)** - Typography and print industry standard

## Unit System Selector

Add a unit selector to your toolbar to allow users to switch between units:

```tsx
import { useUnitSystem, useSetUnitSystem } from "@shadcn/designer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/designer/ui";
import type { Unit } from "@shadcn/designer/utils";

function UnitSystemSelector() {
  const unitSystem = useUnitSystem();
  const setUnitSystem = useSetUnitSystem();

  return (
    <Select value={unitSystem} onValueChange={(v) => setUnitSystem(v as Unit)}>
      <SelectTrigger className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="px">Pixels (px)</SelectItem>
        <SelectItem value="mm">Millimeters (mm)</SelectItem>
        <SelectItem value="cm">Centimeters (cm)</SelectItem>
        <SelectItem value="in">Inches (in)</SelectItem>
        <SelectItem value="pt">Points (pt)</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## DPI Settings

DPI (dots per inch) determines how physical units are converted to pixels. This is crucial for print design:

```tsx
import { useDPI, useSetDPI } from "@shadcn/designer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn/designer/ui";

function DPISelector() {
  const dpi = useDPI();
  const setDPI = useSetDPI();

  return (
    <Select value={String(dpi)} onValueChange={(v) => setDPI(Number(v))}>
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="72">72 DPI</SelectItem>
        <SelectItem value="96">96 DPI</SelectItem>
        <SelectItem value="150">150 DPI</SelectItem>
        <SelectItem value="300">300 DPI</SelectItem>
        <SelectItem value="600">600 DPI</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

## Converting Units

Use the `fromPixels` and `toPixels` utility functions to convert between units:

```tsx
import { fromPixels, toPixels } from "@shadcn/designer/utils";

// Convert pixels to another unit.
const mm = fromPixels(300, "mm", 300); // 25.4mm at 300 DPI

// Convert from another unit to pixels.
const pixels = toPixels(25.4, "mm", 300); // 300px at 300 DPI
```

## Displaying Dimensions

Show frame or layer dimensions in the current unit system:

```tsx
import { useUnitSystem, useDPI, useFrameSize } from "@shadcn/designer";
import { fromPixels } from "@shadcn/designer/utils";

function DimensionDisplay() {
  const unitSystem = useUnitSystem();
  const dpi = useDPI();
  const frameSize = useFrameSize();

  // Convert frame size to current unit.
  const width = fromPixels(frameSize.width, unitSystem, dpi);
  const height = fromPixels(frameSize.height, unitSystem, dpi);

  // Format with appropriate precision.
  const formatValue = (value: number) => {
    if (unitSystem === "px") {
      return Math.round(value);
    }
    return value.toFixed(2).replace(/\.?0+$/, "");
  };

  return (
    <div>
      Frame: {formatValue(width)} × {formatValue(height)} {unitSystem}
    </div>
  );
}
```

## Setting the Default Unit System

Configure the default unit system when initializing the Designer:

```tsx
import { Designer, DesignerCanvas, DesignerFrame } from "@shadcn/designer";

function PrintDesigner() {
  return (
    <Designer
      unitSystem="mm" // Start with millimeters
      dpi={300} // Print quality DPI
    >
      <DesignerCanvas>
        <DesignerFrame />
      </DesignerCanvas>
    </Designer>
  );
}
```

## Unit System Hooks

The Designer provides several hooks for working with units:

### useUnitSystem

Get the current unit system:

```tsx
const unitSystem = useUnitSystem(); // "px" | "mm" | "cm" | "in" | "pt"
```

### useSetUnitSystem

Change the unit system:

```tsx
const setUnitSystem = useSetUnitSystem();
setUnitSystem("mm");
```

### useDPI

Get the current DPI setting:

```tsx
const dpi = useDPI(); // number (e.g., 300)
```

### useSetDPI

Change the DPI setting:

```tsx
const setDPI = useSetDPI();
setDPI(300);
```

## Common DPI Values

Different use cases require different DPI settings:

| DPI | Use Case                              |
| --- | ------------------------------------- |
| 72  | Low-resolution screen design (legacy) |
| 96  | Standard screen resolution            |
| 150 | Draft print quality                   |
| 300 | Professional print quality (standard) |
| 600 | High-quality print / fine details     |

## Unit Conversion Reference

Understanding unit conversions:

- **1 inch = 25.4 millimeters**
- **1 inch = 2.54 centimeters**
- **1 inch = 72 points** (PostScript/CSS standard)
- **Pixels depend on DPI**: At 300 DPI, 1 inch = 300 pixels

### Example Conversions at 300 DPI

| Physical Unit | Pixels     |
| ------------- | ---------- |
| 1 mm          | ~11.81 px  |
| 1 cm          | ~118.11 px |
| 1 in          | 300 px     |
| 1 pt          | ~4.17 px   |

## Use Cases

### Screen Design

Use pixels (px) for web and app interfaces:

```tsx
<Designer unitSystem="px" dpi={96}>
  {/* Your design */}
</Designer>
```

### Print Design

Use physical units (mm, cm, in) for print work:

```tsx
<Designer unitSystem="mm" dpi={300}>
  {/* Your design */}
</Designer>
```

### Typography

Use points (pt) for precise typography control:

```tsx
<Designer unitSystem="pt" dpi={72}>
  {/* Your design */}
</Designer>
```

## Notes

- All measurements are stored internally as pixels for consistency.
- Unit conversions happen on-the-fly when displaying or editing values.
- Changing DPI only affects physical units (mm, cm, in, pt), not pixels.
- The Action components (`ActionSize`, `ActionPosition`, etc.) automatically display values in the current unit system.

---

## Blob Editor

A custom svg blob editor built using the designer.

The following example shows how to build a custom svg blob editor using the designer.

We use custom layers and controls to create a blob editor that allows you to customize the blob's shape and fill color.

## Custom layers

The blob editor uses a custom layer type to render the blob. We use the `LayerType` type to define the layer type and its default values.

The `render` function is used to render the blob. It receives the layer and uses the layer custom values to generate the blob path.

```tsx
import { type LayerType } from "@shadcn/designer";
import { IconBlob } from "@tabler/icons-react";

const SVG_SIZE = 1024;

// Define a blob layer type and its default values.
const blobLayer = {
  name: "Blob",
  type: "blob",
  icon: <IconBlob />,
  defaultValues: {
    name: "Blob",
    value: {
      points: 5,
      randomness: 0.5,
      size: SVG_SIZE,
      smoothness: 0.5,
    },
    cssVars: {},
  },
  render: (layer) => {
    const blobPath = React.useMemo(() => {
      return generateBlob(layer.value);
    }, [layer.value]);

    return (
      <svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        width={SVG_SIZE}
        height={SVG_SIZE}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Blob</title>
        <path d={blobPath} fill={layer.cssVars?.["--fill"]} />
      </svg>
    );
  },
} satisfies LayerType;
```

## Designer

Next, we create our custom designer.

The Designer component is the main component that renders the blob editor. It composes the `DesignerHeader`, `DesignerContent`, `DesignerCanvas`, and `DesignerFrame` components.

1. We pass the `blobLayer` to the `layerTypes` prop of the `Designer` component.
2. We add a default layer to the `layers` prop of the `Designer` component.
3. Since we're only working with one layer, we set the `singleLayerMode` prop to `true`.

```tsx
import { type Layer } from "@shadcn/designer";

const defaultLayers = [
  {
    id: "blob-1",
    type: "blob",
    name: "Blob",
    isLocked: true,
    value: {
      points: 5,
      randomness: 0.5,
      size: SVG_SIZE,
      smoothness: 0.5,
    },
    cssVars: {
      "--width": `${SVG_SIZE}px`,
      "--height": `${SVG_SIZE}px`,
      "--fill": "#2151ef",
    },
  },
] satisfies Layer[];

function BlobEditor() {
  return (
    <Designer layerTypes={[blobLayer]} layers={defaultLayers}>
      <DesignerHeader>
        <DesignerTitle>Blob Editor</DesignerTitle>
      </DesignerHeader>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Custom controls

The blob editor uses custom controls to allow you to customize the blob's shape, size, and color.

We use the `Action` component to create custom controls. See the [Action](/docs/reference/ui#action) page for more information on how to use the `Action` component.

To see a list of built-in actions, see the [Actions](/docs/reference/actions) page.

## ActionBlobFill

The `ActionBlobFill` component is used to create a custom control for the blob's fill color. It uses the `useLayerCssVarAction` hook to get the current fill color and update it when the user selects a new color.

```tsx
import {
  useLayerCssVarAction,
  createLayerCssVarAction,
} from "@shadcn/designer";

const DEFAULT_FILL = "#2151ef";
const fillAction = createLayerCssVarAction("--fill", DEFAULT_FILL);

function ActionBlobFill() {
  const [fill, setFill] = useLayerCssVarAction(fillAction);

  return (
    <Popover>
      <Action>
        <PopoverAnchor />
        <ActionLabel>Fill</ActionLabel>
        <ActionControls>
          <PopoverTrigger asChild>
            <Button
              className="flex-1 uppercase data-[empty=true]:text-muted-foreground data-[empty=true]:capitalize "
              data-empty={fill === ""}
            >
              {fill ? (
                <span>{fill}</span>
              ) : (
                <span className="font-normal text-muted-foreground">
                  Add...
                </span>
              )}
              <span
                className="ml-auto flex size-3 shrink-0 rounded-xs"
                style={{ backgroundColor: fill === "" ? DEFAULT_FILL : fill }}
              />
            </Button>
          </PopoverTrigger>
          <Button
            size="icon"
            onClick={() => setFill(DEFAULT_FILL)}
            disabled={!fill || fill === ""}
          >
            <IconX />
          </Button>
        </ActionControls>
      </Action>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Fill</PopoverTitle>
        </PopoverHeader>
        <ColorPicker value={fill} onValueChange={setFill} />
      </PopoverContent>
    </Popover>
  );
}
```

## ActionBlobPoints

The `ActionBlobPoints` component controls the layer's `value.points` property. It uses the `<Slider />` component to allow the user to select the number of points.

The `value` is updated using the `setLayersProperty` function.

```tsx
import { useSelectedLayers, useSetLayersProperty } from "@shadcn/designer";
import {
  Slider,
  Action,
  ActionLabel,
  ActionControls,
} from "@shadcn/designer/ui";

function ActionBlobPoints() {
  const [selectedLayer] = useSelectedLayers();
  const setLayersProperty = useSetLayersProperty();

  if (!selectedLayer) {
    return null;
  }

  return (
    <Action orientation="vertical">
      <ActionLabel htmlFor="points" className="sr-only">
        Points
      </ActionLabel>
      <ActionControls>
        <Slider
          id="points"
          min={3}
          max={24}
          value={selectedLayer.value.points}
          onValueChange={(value) =>
            setLayersProperty(selectedLayer.id, "value", {
              ...selectedLayer.value,
              points: value,
            })
          }
        />
      </ActionControls>
    </Action>
  );
}
```

---

## Designer Tool

Switch between Move and Hand tools for different interaction modes.

The example shows how to use the `useDesignerTool` and `useSetDesignerTool` hooks to switch between **hand** mode and **move** mode.

Use the Cursor and Hand buttons in the toolbar to switch.

## Switching Tools Programmatically

Use the `useSetDesignerTool` hook to change tools programmatically:

```tsx
import { useDesignerTool, useSetDesignerTool } from "@shadcn/designer";
import { Button } from "@/components/ui/button";

function CustomToolSwitcher() {
  const tool = useDesignerTool();
  const setTool = useSetDesignerTool();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setTool("move")}>Move</Button>
      <Button onClick={() => setTool("hand")}>Hand</Button>
    </div>
  );
}
```

## API Reference

For more details on the hooks, see the [Hooks Reference](/docs/reference/hooks#usedesignertool).

---

## Export Layers

How to export the layers as JSON.

The `useLayers` hook returns the layers object. It contains the layers and the styles for each layer at the current state.

```tsx
import { useLayers } from "@shadcn/designer";

const layers = useLayers();
```

You can use this to export the layers as JSON.

---

## Frame Size

How to change the size of the frame.

You can change the size of the frame by passing `frameSize` prop to the `<Designer />` component.

```tsx
import { Designer, DesignerFrame } from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer frameSize={{ width: 1024, height: 1024 }}>
      <DesignerFrame />
    </Designer>
  );
}
```

## useFrameSize

You can use the `useFrameSize` hook to get the current frame size.

```tsx
import { useFrameSize } from "@shadcn/designer";

function CustomDesigner() {
  const { width, height } = useFrameSize();

  return (
    <div>
      Frame Size: {width}x{height}
    </div>
  );
}
```

## useSetFrameSize

Use the `useSetFrameSize` hook to set the frame size. It returns a function that you can call to set the frame size.

```tsx
import {
  useFrameSize,
  useSetFrameSize,
  useDesignerAction,
  Action,
  ActionControls,
  ActionLabel,
} from "@shadcn/designer";

function ActionFrameSize() {
  const { width, height } = useFrameSize();
  const setFrameSize = useSetFrameSize();
  const designerAction = useDesignerAction();

  const handleFrameSizeChange = (value: string) => {
    const [width, height] = value.split("x");
    if (!width || !height) {
      return;
    }

    setFrameSize({
      width: Number.parseInt(width),
      height: Number.parseInt(height),
    });
    designerAction("ZOOM_FIT");
  };

  return (
    <Action className="gap-0">
      <ActionLabel htmlFor="frame-size">Frame Size</ActionLabel>
      <ActionControls>
        <Select
          value={`${width}x${height}`}
          onValueChange={handleFrameSizeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Frame Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="800x600">800x600</SelectItem>
            <SelectItem value="1024x1024">1024x1024</SelectItem>
            <SelectItem value="1280x720">1280x720</SelectItem>
            <SelectItem value="1080x1920">1080x1920</SelectItem>
          </SelectContent>
        </Select>
      </ActionControls>
    </Action>
  );
}
```

---

## History

How to use the history feature to undo and redo actions.

You can use the `useUndo` and `useRedo` hooks to undo and redo actions. We also provide `useCanUndo` and `useCanRedo` hooks to check if you can undo or redo.

> **Try it out:** Select, drag and resize the text layer. Then use the undo and redo buttons to undo and redo the actions.

```tsx
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@shadcn/designer";

function HistoryControls() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const undo = useUndo();
  const redo = useRedo();

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}
```

## ActionToolbarHistory

The `ActionToolbarHistory` component is a toolbar button that allows you to undo and redo actions.

```tsx
import {
  Designer,
  DesignerToolbar,
  ActionToolbarHistory,
} from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerToolbar>
        <ActionToolbarHistory />
      </DesignerToolbar>
    </Designer>
  );
}
```

---

## Image Generator

An AI image generator with filters.

This example shows how to use the image generator. It uses the [FAL API](https://fal.com/docs/api) to generate images.

We use custom components in the `DesignerToolbar` to show a prompt form, history controls and a cropper.

We've also added a custom `DesignerPanel` to show image filters.

> **Note**: Please note that the demo is limited to 5 image generations per day.

## Image Generator

For this example, we only need to use the `image` layer type. We use the `layerTypes` prop to filter out the other layer types.

Then, we create a single image layer and set the `value` to an empty string. We also set the `cssVars` to the default width and height.

We use `single` mode to only show a single image layer.

```tsx
function ExampleImageGenerator() {
  return (
    <div className="aspect-video">
      <Designer
        mode="single"
        layerTypes={DEFAULT_LAYER_TYPES.filter(
          (layer) => layer.type === "image",
        )}
        defaultLayers={[
          {
            id: "image-1",
            type: "image",
            name: "Generated Image",
            isLocked: true,
            value: "",
            cssVars: {
              "--width": "1024px",
              "--height": "1024px",
            },
          },
        ]}
      >
        <DesignerContent>
          <DesignerCanvas>
            <DesignerFrame />
          </DesignerCanvas>
          <DesignerPanel className="!border-0 absolute inset-y-6 right-6 h-auto w-auto bg-transparent">
            <ActionImageFilters />
          </DesignerPanel>
        </DesignerContent>
        <DesignerToolbar className="rounded-full shadow **:data-[slot=designer-toolbar-button]:rounded-full **:data-[slot=dialog-trigger]:rounded-full">
          <DesignerToolbarGroup>
            <ActionToolbarHistory />
          </DesignerToolbarGroup>
          <DesignerToolbarSeparator />
          <DesignerToolbarGroup>
            <ActionToolbarPromptForm />
          </DesignerToolbarGroup>
          <DesignerToolbarSeparator />
          <DesignerToolbarGroup>
            <ActionToolbarCropper />
          </DesignerToolbarGroup>
        </DesignerToolbar>
      </Designer>
    </div>
  );
}
```

## Prompt Form

The prompt form displayes a text input in the toolbar. When we receive the image from the API, we update the layer `value` with the generated image and reset the crop.

```tsx
function ActionToolbarPromptForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const setLayersProperty = useSetLayersProperty();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const prompt = formData.get("prompt") as string;
    if (!prompt.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // Make request to generate image.
      const response = await fetch("/api/images/generate");

      const data = await response.json();

      if (!data.image) {
        throw new Error("No image generated");
      }

      if (data.image) {
        // Update layer with generated image and reset crop.
        setLayersProperty(
          ["image-1"],
          "value",
          `data:image/jpeg;base64,${data.image}`,
        );
        setLayersProperty(["image-1"], "cssVars", {
          "--width": "1024px",
          "--height": "1024px",
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="relative">
      <Label htmlFor="prompt" className="sr-only">
        Generate an image
      </Label>
      <Input
        id="prompt"
        name="prompt"
        placeholder="Generate an image..."
        className="h-7 min-w-56 bg-input px-2 shadow-none md:text-xs"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={isLoading}
        className="absolute top-1 right-1 size-5 rounded-full"
        size="icon"
      >
        {isLoading ? <IconLoader2 className="animate-spin" /> : <IconArrowUp />}
      </Button>
    </form>
  );
}
```

## Image Cropper

For the cropper, we use the built-in `ActionImageCropper` component.

```tsx
function ActionToolbarCropper() {
  const { open, setOpen } = useActionImage();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DesignerToolbarButton tooltip="Crop">
          <IconCrop />
        </DesignerToolbarButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Image Cropper</DialogTitle>
          <DialogDescription>Crop and resize the image.</DialogDescription>
          <div className="pt-2">
            <ActionImageCropper />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
```

## Image Filters

To show filters, we create a custom action component that updates the layer `cssVars` with the filter values.

```tsx
const filters = [
  {
    name: "vibrant",
    cssVars: {
      "--filter-brightness": "115%",
      "--filter-contrast": "130%",
      "--filter-saturate": "250%",
      "--filter-hue-rotate": "0deg",
    },
  },
  {
    name: "noir",
    cssVars: {
      "--filter-grayscale": "100%",
      "--filter-brightness": "90%",
      "--filter-contrast": "150%",
    },
  },
  {
    name: "vintage",
    cssVars: {
      "--filter-sepia": "60%",
      "--filter-brightness": "110%",
      "--filter-contrast": "80%",
      "--filter-saturate": "120%",
    },
  },
  {
    name: "dreamy",
    cssVars: {
      "--filter-blur": "2px",
      "--filter-brightness": "120%",
      "--filter-saturate": "150%",
      "--filter-contrast": "90%",
    },
  },
  {
    name: "cool",
    cssVars: {
      "--filter-hue-rotate": "200deg",
      "--filter-brightness": "100%",
      "--filter-contrast": "100%",
      "--filter-sepia": "10%",
    },
  },
];

function ActionImageFilters() {
  const layers = useLayers();
  const setLayersProperty = useSetLayersProperty();

  if (!layers[0]) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-2 px-2">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          onClick={() => {
            const cssVarsWithoutFilter = Object.fromEntries(
              Object.entries(layers[0]?.cssVars || {}).filter(
                ([key]) => !key.startsWith("--filter-"),
              ),
            );
            setLayersProperty(["image-1"], "cssVars", {
              ...cssVarsWithoutFilter,
              ...filter.cssVars,
            });
          }}
          variant="ghost"
          size="icon"
          className="size-14 overflow-hidden rounded-sm px-0 hover:scale-110"
          style={{
            filter: Object.entries(filter.cssVars)
              .map(
                ([key, value]) => `${key.replace("--filter-", "")}(${value})`,
              )
              .join(" "),
          }}
        >
          <img
            src={layers[0]?.value}
            alt={filter.name}
            className="aspect-square size-16"
          />
        </Button>
      ))}
    </div>
  );
}
```

---

## Custom Layer

Add custom layer types to the designer.

You can add your own custom layer types to the designer. The following example shows how to add a custom `logo` layer type.

The `logo` layer type has a `value` property that can be used to store the logo name and a `render` function that can be used to render the logo.

> **Try it out:** Click on the logo to select it and pick a different one using the logo picker. You can also change the fill color of the logo using the fill action.

## Layer Type

Start by defining the layer type.

```tsx
import { type LayerType } from "@shadcn/designer";

// Logo data.
const LOGOS = [
  {
    name: "Default",
    path: `<svg .../>`,
  },
  {
    name: "Anthropic",
    path: `<svg .../>`,
  },
  // ...
];

// Custom layer type.
const customLayerTypes = [
  {
    type: "logo",
    name: "Logo",
    defaultValues: {
      name: "Logo",
      value: "Default",
    },
    render: (layer) => {
      const logo = LOGOS.find((logo) => logo.name === layer.value);

      if (!logo) {
        return null;
      }

      return (
        <div
          dangerouslySetInnerHTML={{ __html: logo?.path }}
          style={{
            ...layer.contentStyle,
            width: "100%",
            height: "100%",
          }}
        />
      );
    },
  },
] satisfies LayerType[];
```

## Designer

Create the designer with a default layer. This will render a frame with a `logo` layer with the default logo.

```tsx
function CustomDesigner() {
  return (
    <Designer
      layerTypes={customLayerTypes}
      defaultLayers={[
        {
          id: "logo-1",
          name: "Logo",
          type: "logo",
          value: "Default",
          cssVars: {
            "--width": "400px",
            "--height": "400px",
            "--translate-x": "312px",
            "--translate-y": "312px",
          },
        },
      ]}
    >
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## ActionLogoPicker

To add a logo picker action, we can use the `<Action` component and the `useSetLayersProperty` hook to update the `value` property of the `logo` layer.

```tsx
function ActionLogoPicker() {
  const selectedLayers = useSelectedLayers();
  const layerIds = useSelectedLayerIds();
  const setLayersProperty = useSetLayersProperty();

  return (
    <Action className="gap-0">
      <ActionLabel className="sr-only" htmlFor="logo-picker">
        Select Logo
      </ActionLabel>
      <ActionControls>
        <Select
          disabled={!layerIds.length}
          value={selectedLayers[0]?.value ?? ""}
          onValueChange={(value) => {
            setLayersProperty(layerIds, "value", value);
          }}
        >
          <SelectTrigger id="logo-picker" className="w-28">
            <SelectValue placeholder="Select Logo" />
          </SelectTrigger>
          <SelectContent>
            {LOGOS.map((logo) => (
              <SelectItem key={logo.name} value={logo.name}>
                <span dangerouslySetInnerHTML={{ __html: logo.path }} />
                {logo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ActionControls>
    </Action>
  );
}
```

## ActionLogoFill

To control the fill color of the logo, we use `createLayerCssVarAction` to create an action that can be used to update the `fill` CSS variable.

```tsx
const DEFAULT_FILL = "#000000";
const fillAction = createLayerCssVarAction("--fill", DEFAULT_FILL);

function ActionLogoFill() {
  const selectedLayers = useSelectedLayers();
  const [fill, setFill] = useLayerCssVarAction(fillAction);

  return (
    <Action>
      <ActionLabel className="sr-only" htmlFor="logo-fill">
        Fill
      </ActionLabel>
      <ActionControls>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex-1 uppercase data-[empty=true]:text-muted-foreground data-[empty=true]:capitalize "
              data-empty={fill === ""}
              disabled={!selectedLayers.length}
            >
              <span
                className="ml-auto flex size-3 shrink-0 rounded-xs"
                style={{ backgroundColor: fill === "" ? DEFAULT_FILL : fill }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-48 p-2" sideOffset={12}>
            <ColorPicker value={fill} onValueChange={setFill} />
          </PopoverContent>
        </Popover>
      </ActionControls>
    </Action>
  );
}
```

---

## Layer Tree

Add a layer tree to the designer.

You can add a layer tree to display the layers in the designer.

Use the built-in `PaneLayerTree` component to show the layers in the designer. You can click to select, double click to edit, and use the custom lock controls to lock the layer.

```tsx
import { PaneLayerTree } from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerContent>
        <DesignerPanel>
          <DesignerPane>
            <DesignerPaneTitle>Layers</DesignerPaneTitle>
            <DesignerPaneContent>
              <PaneLayerTree />
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerContent>
    </Designer>
  );
}
```

## Custom Layer Tree

You can also create a custom layer tree by using the `useLayers` hook. The `useLayers` hook returns the layers in the designer.

```tsx
import { useLayers } from "@shadcn/designer";

function CustomLayerTree() {
  const layers = useLayers();

  return (
    <div>
      {layers.map((layer) => (
        <div key={layer.id}>{layer.name}</div>
      ))}
    </div>
  );
}
```

---

## Mobile

How to make the designer mobile friendly.

The following example shows how to make the designer mobile friendly.

Photo by [Polina Shirokova](https://unsplash.com/@aceafel?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/a-woman-leaning-against-a-glass-wall-wearing-a-hat-qwKVxlx_mas?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)

---

## Mode

Single or multiple layer mode.

The `Designer` component has a `mode` prop that can be set to `single` or `multiple`. The default is `multiple`.

In `single` mode, the designer is optimized for working with a single layer, making it perfect for focused editing tasks like image manipulation. This mode streamlines the interface and interactions by removing multi-layer selection capabilities and related controls, providing a more focused editing experience.

In `single` mode, the designer will automatically select the first layer when the designer is mounted.

> **Try it out:** Click on the _Toggle Grayscale_ button to toggle the grayscale filter on the image.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerContent,
  DesignerFrame,
  DesignerHeader,
  createLayerCssVarAction,
  useLayerCssVarAction,
} from "@shadcn/designer";
import { Button } from "@shadcn/designer/ui";

const grayscaleAction = createLayerCssVarAction("--filter-grayscale", "0");

function CustomDesigner() {
  const [grayscale, setGrayscale] = useLayerCssVarAction(grayscaleAction);

  return (
    <Designer
      mode="single"
      frameSize={{ width: 1080, height: 1920 }}
      className="**:[.designer-frame]:bg-muted"
      defaultLayers={[
        {
          id: "image-1",
          type: "image",
          name: "Image",
          value:
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1965&auto=format&fit=crop",
          isLocked: true,
          cssVars: {
            "--translate-x": "0",
            "--translate-y": "0",
            "--width": "1080px",
            "--height": "1920px",
          },
        },
      ]}
    >
      <DesignerHeader>
        <span className="font-black text-foreground text-lg">studio</span>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => setGrayscale(grayscale === "0" ? "100" : "0")}>
            Toggle Grayscale
          </Button>
        </div>
      </DesignerHeader>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

---

## Pages

How to create multi-page designs.

The `<Designer />` component is designed to be unopinionated about state management, making it easy to build multi-page editors.

The following example demonstrates how to implement a page-based workflow with persistent storage. Each page maintains its own set of layers, and you can seamlessly switch between pages using custom actions.

## Pages

We define a `Page` type to represent each page in the editor. A page has an `id`, a `name`, and a `layers` array.

```tsx
type Page = {
  id: string;
  name: string;
  layers: Layer[];
};
```

We use Jotai to manage the state of the editor. We define a `pagesAtom` to store the list of pages, and a `selectedPageIdAtom` to store the ID of the currently selected page.

```tsx
const INITIAL_PAGES = [
  {
    id: "1",
    name: "Page 1",
    layers: [],
  },
];

const pagesAtom = atomWithStorage<Page[]>("pages", INITIAL_PAGES);
const selectedPageIdAtom = atomWithStorage<string>(
  "selectedPageId",
  INITIAL_PAGES[0].id,
);
```

## Designer

The `<Designer />` component is used to create the editor. We use the `layers` prop to pass the layers for the currently selected page and the `onLayersChange` prop to update the layers for the currently selected page.

```tsx
export function CustomDesigner() {
  return (
    <Designer layers={selectedPage?.layers} onLayersChange={handleLayersChange}>
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
      <DesignerToolbar>
    </Designer>
  )
}
```

## ActionPageSelector

```tsx
function ActionPageSelector() {
  const [pages] = useAtom(pageAtom);
  const [selectedPageId, setSelectedPageId] = useAtom(selectedPageIdAtom);

  return (
    <Action>
      <ActionLabel htmlFor="page-selector" className="sr-only">
        Page
      </ActionLabel>
      <ActionControls>
        <Select value={selectedPageId} onValueChange={setSelectedPageId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a page" />
            <SelectContent>
              {pages.map((page) => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectTrigger>
        </Select>
      </ActionControls>
    </Action>
  );
}
```

## ActionAddPage

```tsx
function ActionAddPage() {
  const [pages, setPages] = useAtom(pageAtom);
  const [, setSelectedPageId] = useAtom(selectedPageIdAtom);

  return (
    <Button
      variant="ghost"
      onClick={() => {
        const newPage = {
          id: `page-${pages.length + 1}`,
          name: `Page ${pages.length + 1}`,
          layers: [],
        };
        setPages([...pages, newPage]);
        setSelectedPageId(newPage.id);
      }}
    >
      <IconPlus />
      Add Page
    </Button>
  );
}
```

## ActionReset

```tsx
function ActionReset() {
  const [, setPages] = useAtom(pageAtom);
  const [, setSelectedPageId] = useAtom(selectedPageIdAtom);

  return (
    <Button
      variant="outline"
      onClick={() => {
        setPages(INITIAL_PAGES);
        setSelectedPageId("1");
      }}
    >
      Reset
    </Button>
  );
}
```

## ActionExportPages

```tsx
function ActionExportPages() {
  const [pages] = useAtom(pageAtom);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary">Export</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View JSON</DialogTitle>
          <DialogDescription>
            Here's the JSON representation of the current pages.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto rounded-md border bg-black p-2 font-mono text-white text-xs">
          <pre>{JSON.stringify(pages, null, 2)}</pre>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Performance

Optimized for performance

We have optimized the designer for performance. No extra re-renders. Everything just works. Even with 100 layers.

---

## Read Only

How to make the designer read only.

Use the `DesignerStaticFrame` component to create a read only designer. This component is useful when you want to display a static image with all the layers.

> **Note:** The example below is rendered in full size. Pan around to see all the layers.

```tsx
import { DesignerStaticFrame } from "@shadcn/designer";

function ReadOnlyFrame() {
  return (
    <DesignerStaticFrame
      width={1080}
      height={1920}
      layers={
        [
          // ...
        ]
      }
    />
  );
}
```

See the [Convert to Image](/docs/guides/convert-image) example to see an example of how to export your layers to an image.

---

## Save to Database

This example shows how to save and load layers from a database.

Learn how to persist designer layers to a database and load them back for editing. We'll use Next.js server actions with a unified `upsertPost` function to handle both create and update operations.

> **Try it out:** Open the example below in a new tab and try it out. <a href="/examples/save" target="_blank" rel="noreferrer" className="text-blue-600 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 dark:hover:text-blue-300">Open in new tab <IconArrowUpRight className="size-3" /></a>

## Overview

The save functionality provides a complete workflow:

1. **Create** - Save new designs and get a unique post ID
2. **Edit** - Load existing designs by post ID and make changes
3. **Update** - Save changes to existing posts while preserving metadata
4. **View** - Display saved designs in a static, read-only format

## ActionSave Component

The `ActionSave` component demonstrates how to save layers using the `useLayers` hook and server actions.

```tsx
"use client";

import { useLayers } from "@shadcn/designer";
import { Button } from "@shadcn/designer/ui";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { upsertPost } from "./actions";

function ActionSave() {
  const layers = useLayers();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const { error, postId } = await upsertPost(layers);

      if (error) {
        toast.error(error);
        return;
      }

      if (postId) {
        router.push(`/examples/save/${postId}`);
      }
    });
  };

  return (
    <form onSubmit={handleSave}>
      <Button
        variant="primary"
        type="submit"
        disabled={isPending}
        isLoading={isPending}
      >
        Save
      </Button>
    </form>
  );
}
```

## upsertPost

> **Note:** We're using Redis (Upstash) as the database, but you can adapt this to work with any database (PostgreSQL, MongoDB, etc.).

The `upsertPost` function handles both creating new posts and updating existing ones.

```tsx
"use server";

import type { Layer } from "@shadcn/designer";
import { generateId } from "@shadcn/designer/utils";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function upsertPost(layers: Layer[], postId?: string) {
  try {
    // If postId provided, update existing post.
    if (postId) {
      const existing = await redis.get(`post:${postId}`);

      if (!existing) {
        return {
          postId: null,
          error: "Post not found",
        };
      }

      await redis.set(`post:${postId}`, {
        layers,
        createdAt:
          typeof existing === "object" && "createdAt" in existing
            ? existing.createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return {
        postId,
        error: null,
      };
    }

    // Create new post.
    const newPostId = generateId();
    await redis.set(`post:${newPostId}`, {
      layers,
      createdAt: new Date().toISOString(),
    });

    return {
      postId: newPostId,
      error: null,
    };
  } catch (error) {
    console.error("Failed to upsert post", error);
    return {
      postId: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

## Loading Saved Layers

To load an existing design for editing, create a dynamic route that fetches the layers and passes both the layers and postId to the editor:

```tsx
import { notFound } from "next/navigation";
import { getPost } from "../actions";
import { SaveExampleEditor } from "../editor";

export default async function SaveExampleViewPage(props: {
  params: Promise<{
    postId: string;
  }>;
}) {
  const params = await props.params;
  const layers = await getPost(params.postId);

  if (!layers) {
    notFound();
  }

  return <SaveExampleEditor layers={layers} postId={params.postId} />;
}
```

## getPost

```tsx
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getPost(postId: string) {
  const entry = await redis.get<
    { layers: Layer[]; createdAt: string } | string
  >(`post:${postId}`);

  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    try {
      const parsed = JSON.parse(entry) as {
        layers: Layer[];
        createdAt: string;
      };
      return parsed.layers ?? null;
    } catch (error) {
      console.error("Failed to parse stored layers", error);
      return null;
    }
  }

  if (!Array.isArray(entry.layers)) {
    return null;
  }

  return entry.layers;
}
```

## Static View

For a read-only preview, use the `DesignerStaticFrame` component:

```tsx
import { DesignerStaticFrame } from "@shadcn/designer";

export function SaveExampleViewStaticFrame({ layers }: { layers: Layer[] }) {
  return <DesignerStaticFrame layers={layers} width={1080} height={1080} />;
}
```

---

## Zoom

Zoom in and out controls and custom controls.

The designer ships with a `DesignerCanvas` component that is zoomable and panable. It has support for keyboard shortcuts and touch gestures.

Wrap your `DesignerFrame` component with the `DesignerCanvas` component to enable zooming and panning.

```tsx
<DesignerCanvas>
  <DesignerFrame />
</DesignerCanvas>
```

## ActionToolbarZoom

Use the `ActionToolbarZoom` component to add zoom in and out controls to your designer.

```tsx
import {
  ActionToolbarZoom,
  DesignerToolbar,
  DesignerToolbarGroup,
} from "@shadcn/designer";

function CustomToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <ActionToolbarZoom />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

## Keyboard Shortcuts

You can also use the keyboard shortcuts to zoom in and out.

- CMD or Ctrl + + to zoom in
- CMD or Ctrl + - to zoom out
- CMD or Ctrl + 0 to reset zoom
- CMD or Ctrl + 1 to zoom to fit
- CMD or Ctrl + 2 to zoom to 100%

## Custom Zoom Controls

You can bring your own zoom controls using the `useZoom` and `useSetZoom` hooks.

```tsx
function CustomZoomControls() {
  const zoom = useZoom();
  const setZoom = useSetZoom();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setZoom(zoom + 0.1)}>Zoom In</Button>
      <Button onClick={() => setZoom(zoom - 0.1)}>Zoom Out</Button>
      <Button onClick={() => setZoom(1)}>Reset</Button>
    </div>
  );
}
```

## designerAction

You can also use the `designerAction` hook to set more controlled zoom levels.

This will handle maximum and minimum zoom levels.

```tsx
function CustomZoomControls() {
  const designerAction = useDesignerAction();

  return (
    <div className="flex gap-2">
      <Button onClick={() => designerAction("ZOOM_IN")}>Zoom In</Button>
      <Button onClick={() => designerAction("ZOOM_OUT")}>Zoom Out</Button>
      <Button onClick={() => designerAction("ZOOM_RESET")}>Reset</Button>
    </div>
  );
}
```

---

## Installation

Learn how to install the @shadcn/designer package and get started with the designer.

## License Required

You will need a license key to install the package. You can learn more about the pricing and purchase a business license [here](/docs/pricing).

## Create Project

First, let's setup a new Vite + Tailwind project.

> **Note:** You can use any React framework with the designer. This guide uses
> Vite + React + Tailwind. The only requirement is that you have Tailwind
> installed.

```bash
npx create-vite@latest my-designer --template react-ts
```

## Configure Tailwind

The `@shadcn/designer` package is built with Tailwind CSS. You will need to install Tailwind and configure it in your project.

### Install Tailwind

Add the following dependencies to your project.

```bash
npm install tailwindcss @tailwindcss/vite
```

### Configure the Vite plugin

Import the Tailwind Vite plugin in your `vite.config.ts` file.

```tsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### Import Tailwind CSS

Replace the content of your `src/index.css` file with the following.

```tsx
@import "tailwindcss";
```

## Install Package

Next, let's install the package. You will need a license key to install the package. You can purchase a business license [here](https://ds.shadcn.com/pricing).

```bash
npm install https://ds.shadcn.com/registry\?license\=YOUR_LICENSE_KEY
```

Import the `Designer` component from `@shadcn/designer` and the styles from `@shadcn/designer/styles.css`.

```tsx
import { Designer } from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return <Designer className="h-svh" />;
}
```

Make sure you also import the styles from `@shadcn/designer/styles.css`. This should be imported after your own styles.

> **Note:** The Designer will take up the height of its container. The `h-svh` class is used to make the designer take up the full height of the viewport.

## Components

The `Designer` is built to be composable. You build your custom designer by composing the components that you need.

The following will setup a basic designer with a canvas and a frame. The default frame size is `1024x1024`.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## Layers

Now that your designer is setup, you can add layers to it. Press T on your keyboard to add a new `text` layer.

You will see a new text layer added to the canvas. You can drag the text layer around the canvas and use the handles to resize it.

The designer comes with the following layer types by default: `frame`, `text` and `image`.

You can extend the designer by adding your own layer types. See the [Custom Layer](/docs/concepts/layers) example for more information.

## Toolbar

Let's place a toolbar with buttons to add layers to the canvas.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionToolbarAddLayer,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

You should see a new toolbar at the bottom of the canvas. The toolbar has one action to add a new layer.

## Panels

Now that we have a canvas and we can add layers to it, let's add a `<DesignerPanel />` to display layer controls.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionToolbarAddLayer,
  DesignerPanel,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel />
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

This will place a panel on the right side of the canvas. We can have multiple panels in the designer. Let's add a panel to the left side of the canvas.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionToolbarAddLayer,
  DesignerPanel,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerPanel />
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel />
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

## Panes

We use `<DesignerPane />` to display and group controls. Let's add a new pane to the right panel.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionToolbarAddLayer,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerPanel />
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel>
          <DesignerPane>
            <DesignerPaneTitle>Layers</DesignerPaneTitle>
            <DesignerPaneContent>Hello World</DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

You should see a new pane with the title "Layers" and the content "Hello World" in the right panel.

## Actions and Controls

To display and control the properties of a layer, we use [`<Action />`](/docs/reference/actions) components.

The `@shadcn/designer` package ships with several actions out of the box. **We provide the necessary API and components to create your own custom actions.**

Let's add a [`<ActionPosition />`](/docs/reference/actions#actionposition) to the right panel to display the position of the layer.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionPosition,
  ActionToolbarAddLayer,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerPanel />
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <DesignerPanel>
          <DesignerPane>
            <DesignerPaneTitle>Layers</DesignerPaneTitle>
            <DesignerPaneContent>
              <ActionPosition />
            </DesignerPaneContent>
          </DesignerPane>
        </DesignerPanel>
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

You should see a new _Position_ action in the right panel. It comes with `X` and `Y` inputs to control the position of the layer. If you click and drag a layer you should see the `X` and `Y` values change.

## More Actions

Let's build a custom panel with more actions and import it into our designer.

Create a new file called `src/panel-right.tsx` and add the following code.

```tsx
import {
  ActionFill,
  ActionPadding,
  ActionBoxShadow,
  DesignerPanel,
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
  ActionPosition,
  ActionSize,
  ActionCorner,
  ActionBorder,
  ActionRotate,
  ActionDirection,
  ActionTextValue,
  ActionImageFit,
  ActionImageFilter,
  ActionFont,
  ActionColor,
  ActionFontSize,
  ActionLineHeight,
  ActionLetterSpacing,
  ActionTextAlign,
  ActionAlignItems,
  ActionFontStyle,
  ActionTextDecoration,
  ActionTextTransform,
  ActionTextShadow,
  ActionTextStroke,
} from "@shadcn/designer";

export function PanelRight() {
  return (
    <DesignerPanel>
      <DesignerPane>
        <DesignerPaneTitle>Layer</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionPosition />
          <ActionSize />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane>
        <DesignerPaneTitle>Styles</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionCorner />
          <ActionBorder />
          <ActionBoxShadow />
          <ActionPadding />
          <ActionFill />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane>
        <DesignerPaneTitle>Transforms</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionRotate />
          <ActionDirection />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane showForLayerTypes={["text"]}>
        <DesignerPaneContent>
          <ActionTextValue />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane showForLayerTypes={["image"]}>
        <DesignerPaneTitle>Image</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionImageFit />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane showForLayerTypes={["image"]}>
        <DesignerPaneTitle>Filters</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionImageFilter />
        </DesignerPaneContent>
      </DesignerPane>
      <DesignerPane showForLayerTypes={["text", "icon"]}>
        <DesignerPaneTitle>Text</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionColor />
          <ActionFontSize />
          <ActionLineHeight />
          <ActionLetterSpacing />
          <ActionTextAlign />
          <ActionAlignItems />
          <ActionFontStyle />
          <ActionTextDecoration />
          <ActionTextTransform />
          <ActionTextShadow />
          <ActionTextStroke />
        </DesignerPaneContent>
      </DesignerPane>
    </DesignerPanel>
  );
}
```

Then import the `PanelRight` component into your `src/App.tsx` file.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerCanvas,
  DesignerFrame,
  DesignerToolbar,
  DesignerToolbarGroup,
  ActionToolbarAddLayer,
  DesignerPanel,
} from "@shadcn/designer";
import "@shadcn/designer/styles.css";

import { PanelRight } from "./panel-right";

export default function App() {
  return (
    <Designer className="h-svh">
      <DesignerContent>
        <DesignerPanel />
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
        <PanelRight />
      </DesignerContent>
      <DesignerToolbar>
        <DesignerToolbarGroup>
          <ActionToolbarAddLayer />
        </DesignerToolbarGroup>
      </DesignerToolbar>
    </Designer>
  );
}
```

You should see a new panel on the right side of the canvas. The panel has the actions to control the layer.

See the [Actions](/docs/reference/actions) section for more information on available actions.

## Next Steps

- [Add a custom layer to the designer](/docs/concepts/layers)
- [Browse more examples](/docs/examples)
- Read more about [components](/docs/reference/designer) and [hooks](/docs/reference/hooks)

---

## Update

How to update shadcn/designer to the latest version.

In your `package.json` file, update the `version={PACKAGE_VERSION}` to the latest version. The latest version is **{PACKAGE_VERSION}**.

```json
{
  "name": "my-designer",
  "dependencies": {
    "@shadcn/designer": "https://ds.shadcn.com/registry?version=PACKAGE_VERSION&license=YOUR_LICENSE_KEY"
  }
}
```

Then run `pnpm install` to pull the latest version from the registry.

---

## Convert to Image

Learn how to convert layers into an image.

The `@shadcn/designer` package ships with a `DesignerStaticFrame` component that you can use to render static layers.

You can use this component to render the static frame on a page and then use a service like [Microlink](https://microlink.io/) to capture the image. This is what we use for the demo.

### Create a new page

Create a new page to render the static frame.

```tsx
import { DesignerStaticFrame } from "@shadcn/designer";

export function ImagePage() {
  return (
    <DesignerStaticFrame
      layers={layers}
      width={1080}
      height={1080}
      id="post-image"
    />
  );
}
```

### Capture the image

Use the `mql` package from Microlink to capture the image.

**Note:** Make sure `mql` has access to the the page. It will not work on the `dev` server.

```ts
import mql from "@microlink/mql";

const imageUrl = "FULL_URL_TO_YOUR_PAGE";
const { data } = await mql(imageUrl, {
  screenshot: {
    element: "#post-image",
    type: "jpeg",
    fullPage: false,
  },
});
```

---

## Image Browser

Using the image browser to select images for your layers.

The `ActionImageBrowser` component is a plugin for the `ActionImage` component. It allows you to select images from a list of images. We can use it to build a custom image browser plugin.

In the following example, we'll build a meme browser plugin. We'll use the _Imgflip_ API to fetch memes.

### Download the Starter Template

We'll start by downloading the starter template.

### Add License Key

Add your LICENSE KEY to the `package.json` file:

```json
"@shadcn/designer": "https://ds.shadcn.com/registry?license=YOUR_LICENSE_KEY&version=0.4.2",
```

### Install Dependencies

Install the dependencies by running the following command:

```bash
pnpm install
```

### Update the frame size

Let's update the example post frameSize to 1080x1080 which works better for memes.

```tsx
import { Layer } from "@shadcn/designer";

export async function getPost() {
  return {
    id: "xg9x0ff27hx09n0d",
    title: "Untitled Post",
    layers: [
      {
        id: "xqxbjdzdjyz",
        name: "Image",
        type: "image",
        value: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d",
        cssVars: {
          "--width": "1080px", // <--- Update this
          "--height": "1080px", // <--- Update this
          "--z-index": "0",
          "--translate-x": "0px",
          "--translate-y": "0px",
        },
      },
    ],
    meta: {
      frameSize: {
        width: 1080, // <--- Update this
        height: 1080, // <--- Update this
      },
    },
  };
}
```

If you visit `http://localhost:3000` you should see the following:

![Image Browser](/images/G4jRrLro.png)

### Add a Meme Browser

Let's add our meme browser to the `ActionImage` component. We can use the `ActionImageBrowser` component to build our meme browser.

In `components/editor.tsx`, find the `PanelRight` component and add the following to `ActionImage` component:

```tsx
<ActionImage
  plugins={[
    // ... other plugins
    {
      id: "meme-browser",
      label: "Meme Browser",
      description: "Select a meme from the browser.",
      component: <ActionImageBrowser apiUrl="/api/memes" />,
    },
  ]}
/>
```

If you select an image layer and click the Image button in the right panel, you should see a new _Meme Browser_ tab in the image dialog.

## Build our API route

The `ActionImageBrowser` component requires an API route to fetch the images. We'll create a simple API route to fetch memes from the _imgflip_ API.

```tsx
import { NextRequest, NextResponse } from "next/server";

import { imagesResponseSchema } from "@shadcn/designer/schema";

const DEFAULT_QUERY = "Pikachu";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || DEFAULT_QUERY;
  const page = Number(searchParams.get("page")) || 1;
  const per_page = Number(searchParams.get("per_page")) || 9;

  const url = `https://api.imgflip.com/get_memes`;
  const response = await fetch(url);
  const data = await response.json();

  // Imgflip does not have pagination.
  // We'll implement a faux pagination and search.
  const startIndex = (page - 1) * per_page;
  const endIndex = startIndex + per_page;
  const memes = data.data.memes.filter((meme: { name: string }) =>
    meme.name.toLowerCase().includes(query.toLowerCase()),
  );
  const thisPage = memes.slice(startIndex, endIndex);

  return NextResponse.json(
    imagesResponseSchema.parse({
      results: thisPage.map((meme: { id: string; url: string }) => ({
        id: meme.id,
        url: meme.url,
        thumbnailUrl: meme.url,
      })),
      total: memes.length,
      total_pages: Math.ceil(memes.length / per_page),
    }),
  );
}
```

To make sure we return the correct data structure, we'll use the `imagesResponseSchema` from the `@shadcn/designer/schema` package.

### That's it!

That's all you need. You can now select an image, open the image dialog, search and apply a meme to the layer.

---

## Designer

The core components for building the design canvas and layout structure.

The designer provides a comprehensive set of React components for building design applications. These components handle everything from the core designer interface to individual property editors and UI primitives.

## Designer

The main container component that provides context and state management for the entire design interface.

The Designer component supports both **controlled** and **uncontrolled** patterns, similar to React form components.

## Uncontrolled

Use `defaultLayers` when you want the Designer to manage its own internal state. This is perfect for demos, static examples, and applications where you don't need external state management.

```tsx
import { Designer } from "@shadcn/designer";

function UncontrolledDesigner() {
  return (
    <Designer
      defaultLayers={[
        {
          id: "text-1",
          type: "text",
          name: "Hello",
          value: "Hello World",
          cssVars: {
            "--width": "200px",
            "--height": "100px",
          },
        },
      ]}
      frameSize={{ width: 1024, height: 1024 }}
      onMount={() => {
        console.log("Designer mounted");
      }}
    >
      {/* Designer content */}
    </Designer>
  );
}
```

## Controlled

Use `layers` + `onLayersChange` when you need full control over layer state.

```tsx
import { Designer } from "@shadcn/designer";
import { useState } from "react";

function ControlledDesigner() {
  const [layers, setLayers] = useState([
    {
      id: "text-1",
      type: "text",
      name: "Hello",
      value: "Hello World",
      cssVars: {
        "--width": "200px",
        "--height": "100px",
      },
    },
  ]);

  const handleLayersChange = (newLayers) => {
    setLayers(newLayers);
    // Optionally save to external storage
    saveToDatabase(newLayers);
  };

  return (
    <Designer layers={layers} onLayersChange={handleLayersChange}>
      {/* Designer content */}
    </Designer>
  );
}
```

## Props

| Prop             | Type                                | Required | Description                                        |
| ---------------- | ----------------------------------- | -------- | -------------------------------------------------- |
| `defaultLayers`  | `Layer[]`                           | No\*     | Initial layers for uncontrolled mode               |
| `layers`         | `Layer[]`                           | No\*     | Current layers for controlled mode                 |
| `onLayersChange` | `(layers: Layer[]) => void`         | No\*     | Callback for controlled mode                       |
| `layerTypes`     | `LayerType[]`                       | No       | Available layer types (defaults to built-in types) |
| `frameSize`      | `{ width: number, height: number }` | No       | Canvas frame size (default: 1024x1024)             |
| `keybindings`    | `Record<string, Keybinding>`        | No       | Keyboard shortcuts configuration                   |
| `mode`           | `"single" \| "multiple"`            | No       | Designer mode (default: "multiple")                |
| `onMount`        | `() => void`                        | No       | Callback when designer is mounted                  |
| `debug`          | `boolean`                           | No       | Enable debug mode                                  |
| `className`      | `string`                            | No       | Additional CSS classes                             |

**Important notes:**

- You can use one of `defaultLayers` (uncontrolled) or `layers` + `onLayersChange` (controlled), but not both.
- The `onLayersChange` callback is only called for user actions, not prop changes
- This prevents infinite loops when implementing controlled components
- Each pattern provides complete isolation - controlled components manage external state, uncontrolled components manage internal state

### mode

The `Designer` component has a `mode` prop that can be set to `single` or `multiple`. The default is `multiple`.

When in `single` mode, the designer is optimized for single layer editing, ideal for cases where you're only working with one layer for example an image editor.

In `single` mode, the designer will automatically select the first layer when the designer is mounted.

## DesignerHeader

Header area for toolbar controls and actions.

```tsx
import { Designer, DesignerHeader } from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader>{/* Header controls */}</DesignerHeader>
    </Designer>
  );
}
```

## DesignerContent

Main content area that contains the canvas and panels.

```tsx
import { Designer, DesignerHeader, DesignerContent } from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader />
      <DesignerContent>{/* Panels and canvas */}</DesignerContent>
    </Designer>
  );
}
```

## DesignerCanvas

Canvas area where the design frame is rendered.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerHeader,
  DesignerCanvas,
  DesignerFrame,
} from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader />
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## DesignerFrame

The interactive frame that contains and renders all layers.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerHeader,
  DesignerCanvas,
  DesignerFrame,
} from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader />
      <DesignerContent>
        <DesignerCanvas>
          <DesignerFrame />
        </DesignerCanvas>
      </DesignerContent>
    </Designer>
  );
}
```

## DesignerStaticFrame

A static version of the frame for non-interactive rendering.

```tsx
import { DesignerStaticFrame } from "@shadcn/designer";

function PreviewFrame() {
  return <DesignerStaticFrame layers={layers} width={1024} height={1024} />;
}
```

You can use this component to generate a static image of the design. See the [Convert to Image](/docs/guides/convert-image) guide for more information.

## DesignerPanel

Side panel container for organizing controls and tools. You can use one or both of these panels to render a designer with left and right panels.

```tsx
import {
  Designer,
  DesignerContent,
  DesignerHeader,
  DesignerCanvas,
  DesignerFrame,
  DesignerPanel,
  DesignerPane,
} from "@shadcn/designer";

function CustomDesigner() {
  return (
    <Designer>
      <DesignerHeader />
      <DesignerContent>
        <DesignerPanel>{/* Left Panel */}</DesignerPanel>
        <DesignerCanvas />
        <DesignerPanel>{/* Right Panel */}</DesignerPanel>
      </DesignerContent>
    </Designer>
  );
}
```

## DesignerPane

Individual pane within a panel with a title and content. Use a pane to group related controls and tools. Panes can be configured to show only when specific layer types are selected.

```tsx
import {
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
  ActionImage,
} from "@shadcn/designer";

function PaneImageActions() {
  return (
    <DesignerPane showForLayerTypes={["image"]}>
      <DesignerPaneTitle>Image</DesignerPaneTitle>
      <DesignerPaneContent>
        <ActionImage />
      </DesignerPaneContent>
    </DesignerPane>
  );
}
```

| Prop                | Type                | Required | Description                                                                           |
| ------------------- | ------------------- | -------- | ------------------------------------------------------------------------------------- |
| `showForLayerTypes` | `string[] \| "all"` | No       | Controls when the pane is visible based on selected layer types. Defaults to `"all"`. |

```tsx
import {
  DesignerPane,
  DesignerPaneTitle,
  DesignerPaneContent,
} from "@shadcn/designer";

function ConditionalPanes() {
  return (
    <>
      {/* Always visible (default) */}
      <DesignerPane>
        <DesignerPaneTitle>General</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionPosition />
          <ActionSize />
        </DesignerPaneContent>
      </DesignerPane>

      {/* Only visible when text layers are selected */}
      <DesignerPane showForLayerTypes={["text"]}>
        <DesignerPaneTitle>Text</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionTextValue />
          <ActionFontSize />
          <ActionColor />
        </DesignerPaneContent>
      </DesignerPane>

      {/* Only visible when image layers are selected */}
      <DesignerPane showForLayerTypes={["image"]}>
        <DesignerPaneTitle>Image</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionImage />
          <ActionImageFit />
        </DesignerPaneContent>
      </DesignerPane>

      {/* Visible when text OR icon layers are selected */}
      <DesignerPane showForLayerTypes={["text", "icon"]}>
        <DesignerPaneTitle>Typography</DesignerPaneTitle>
        <DesignerPaneContent>
          <ActionFont />
          <ActionTextAlign />
        </DesignerPaneContent>
      </DesignerPane>
    </>
  );
}
```

**Available Layer Types:**

- `"frame"` - Frame/container layers
- `"text"` - Text layers
- `"image"` - Image layers
- Custom layer types defined in your `LayerType[]` configuration

**Visibility Rules:**

- `showForLayerTypes="all"` (default): Pane is always visible
- `showForLayerTypes={["text"]}`: Pane is visible only when text layers are selected
- `showForLayerTypes={["text", "image"]}`: Pane is visible when text OR image layers are selected
- The pane is visible only when **all** selected layers match the specified types

## DesignerToolbar

Toolbar container for grouping actions and controls. This component is displayed as a floating toolbar at the bottom of the designer.

```tsx
import {
  DesignerToolbar,
  DesignerToolbarGroup,
  DesignerToolbarButton,
  DesignerToolbarSeparator,
} from "@shadcn/designer";
import { IconArrowBackUp } from "@tabler/icons-react";

function CustomDesigner() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <DesignerToolbarButton tooltip="Example" onClick={() => {}}>
          <IconArrowBackUp />
        </DesignerToolbarButton>
      </DesignerToolbarGroup>
      <DesignerToolbarSeparator />
      <DesignerToolbarGroup />
      <DesignerToolbarGroup />
    </DesignerToolbar>
  );
}
```

- Use the `DesignerToolbarButton` component to add buttons to the toolbar.
- Use the `DesignerToolbarSeparator` component to add a separator between groups of buttons.

---

## Actions

Property editor components for modifying layer properties.

The `@shadcn/designer` package ships with a set of property editor components for modifying layer properties. We call these components "actions" because they are used to modify the properties of the selected layer.

See the [`Action`](/docs/reference/ui#action) component for more information on how to build your own actions.

## Layout & Positioning

### ActionSize

Controls for layer width and height.

```tsx
import { ActionSize } from "@shadcn/designer";

function SizeControls() {
  return <ActionSize />;
}
```

### ActionPosition

Controls for layer X and Y position.

```tsx
import { ActionPosition } from "@shadcn/designer";

function PositionControls() {
  return <ActionPosition />;
}
```

### ActionRotate

Control for layer rotation.

```tsx
import { ActionRotate } from "@shadcn/designer";

function RotationControl() {
  return <ActionRotate />;
}
```

### ActionDirection

Control for flex direction property.

```tsx
import { ActionDirection } from "@shadcn/designer";

function DirectionControl() {
  return <ActionDirection />;
}
```

### ActionAlignItems

Controls for flex alignment properties.

```tsx
import { ActionAlignItems } from "@shadcn/designer";

function AlignmentControls() {
  return <ActionAlignItems />;
}
```

### ActionPadding

Controls for layer padding.

```tsx
import { ActionPadding } from "@shadcn/designer";

function PaddingControls() {
  return <ActionPadding />;
}
```

## Visual Styling

### ActionFill

Background color and fill controls.

```tsx
import { ActionFill } from "@shadcn/designer";

function FillControls() {
  return <ActionFill />;
}
```

### ActionColor

Text color controls.

```tsx
import { ActionColor } from "@shadcn/designer";

function ColorControls() {
  return <ActionColor />;
}
```

### ActionCorner

Border radius controls.

```tsx
import { ActionCorner } from "@shadcn/designer";

function CornerControls() {
  return <ActionCorner />;
}
```

### ActionBorder

Border style and width controls.

```tsx
import { ActionBorder } from "@shadcn/designer";

function BorderControls() {
  return <ActionBorder />;
}
```

### ActionBoxShadow

Box shadow controls.

```tsx
import { ActionBoxShadow } from "@shadcn/designer";

function ShadowControls() {
  return <ActionBoxShadow />;
}
```

## Typography

### ActionFont

Font family picker with API integration.

```tsx
import { ActionFont } from "@shadcn/designer";

function FontPicker() {
  return <ActionFont apiUrl="https://api.example.com/fonts" />;
}
```

**Props:**

| Prop     | Type     | Required | Description                |
| -------- | -------- | -------- | -------------------------- |
| `apiUrl` | `string` |          | API endpoint for font data |

### ActionFontSize

Font size control.

```tsx
import { ActionFontSize } from "@shadcn/designer";

function FontSizeControl() {
  return <ActionFontSize />;
}
```

### ActionFontStyle

Font weight and style controls.

```tsx
import { ActionFontStyle } from "@shadcn/designer";

function FontStyleControls() {
  return <ActionFontStyle />;
}
```

### ActionLineHeight

Line height control.

```tsx
import { ActionLineHeight } from "@shadcn/designer";

function LineHeightControl() {
  return <ActionLineHeight />;
}
```

### ActionLetterSpacing

Letter spacing control.

```tsx
import { ActionLetterSpacing } from "@shadcn/designer";

function LetterSpacingControl() {
  return <ActionLetterSpacing />;
}
```

### ActionTextAlign

Text alignment controls.

```tsx
import { ActionTextAlign } from "@shadcn/designer";

function TextAlignControls() {
  return <ActionTextAlign />;
}
```

### ActionTextDecoration

Text decoration controls (underline, strikethrough).

```tsx
import { ActionTextDecoration } from "@shadcn/designer";

function TextDecorationControls() {
  return <ActionTextDecoration />;
}
```

### ActionTextTransform

Text case transformation controls.

```tsx
import { ActionTextTransform } from "@shadcn/designer";

function TextTransformControls() {
  return <ActionTextTransform />;
}
```

### ActionTextShadow

Text shadow controls.

```tsx
import { ActionTextShadow } from "@shadcn/designer";

function TextShadowControls() {
  return <ActionTextShadow />;
}
```

### ActionTextStroke

Text stroke/outline controls.

```tsx
import { ActionTextStroke } from "@shadcn/designer";

function TextStrokeControls() {
  return <ActionTextStroke />;
}
```

### ActionTextValue

Text content editor.

```tsx
import { ActionTextValue } from "@shadcn/designer";

function TextEditor() {
  return <ActionTextValue />;
}
```

## Image Controls

### ActionImage

Configurable image plugin container.

```tsx
import { ActionImage } from "@shadcn/designer";

function ImageControls() {
  return (
    <ActionImage
      plugins={["browser", "cropper", "url", "fit", "filter"]}
      apiUrl="https://api.example.com/images"
    />
  );
}
```

**Props:**

| Prop      | Type       | Required | Description                       |
| --------- | ---------- | -------- | --------------------------------- |
| `plugins` | `string[]` | No       | Array of enabled image plugins    |
| `apiUrl`  | `string`   | No       | API endpoint for image operations |

### ActionImageBrowser

Image browser with API integration.

```tsx
import { ActionImageBrowser } from "@shadcn/designer";

function ImageBrowser() {
  return <ActionImageBrowser apiUrl="https://api.example.com/images" />;
}
```

### ActionImageCropper

Image cropping tool.

```tsx
import { ActionImageCropper } from "@shadcn/designer";

function ImageCropper() {
  return <ActionImageCropper />;
}
```

### ActionImageUrl

URL-based image input.

```tsx
import { ActionImageUrl } from "@shadcn/designer";

function ImageUrlInput() {
  return <ActionImageUrl />;
}
```

### ActionImageFit

Image fit and sizing controls.

```tsx
import { ActionImageFit } from "@shadcn/designer";

function ImageFitControls() {
  return <ActionImageFit />;
}
```

### ActionImageFilter

Image filter controls.

```tsx
import { ActionImageFilter } from "@shadcn/designer";

function ImageFilterControls() {
  return <ActionImageFilter />;
}
```

---

## Toolbar

Components for building the floating designer toolbar.

These components are used to build the floating toolbar at the bottom of the designer. See also the [DesignerToolbar](/docs/reference/designer#designertoolbar) component in the [Designer](/docs/reference/designer) section.

## Toolbar Actions

### ActionToolbarAddLayer

Controls for adding new layers.

```tsx
import {
  ActionToolbarAddLayer,
  DesignerToolbar,
  DesignerToolbarGroup,
} from "@shadcn/designer";

function CustomDesignerToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <ActionToolbarAddLayer />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

### ActionToolbarHistory

Undo and redo controls.

```tsx
import {
  ActionToolbarHistory,
  DesignerToolbar,
  DesignerToolbarGroup,
} from "@shadcn/designer";

function CustomDesignerToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <ActionToolbarHistory />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

### ActionToolbarZoom

Zoom controls.

```tsx
import {
  ActionToolbarZoom,
  DesignerToolbar,
  DesignerToolbarGroup,
} from "@shadcn/designer";

function CustomDesignerToolbar() {
  return (
    <DesignerToolbar>
      <DesignerToolbarGroup>
        <ActionToolbarZoom />
      </DesignerToolbarGroup>
    </DesignerToolbar>
  );
}
```

---

## UI

Primitive UI components for building custom designer controls and actions.

## Action

Use the `Action` component to compose your own actions for consistent layouts and styles.

```tsx
import { Action, ActionControls, ActionLabel } from "@shadcn/designer/ui";

function CustomAction() {
  return (
    <Action orientation="vertical | horizontal">
      <ActionLabel htmlFor="width">Width</ActionLabel>
      <ActionControls>
        <InputNumber id="width" />
      </ActionControls>
    </Action>
  );
}
```

## Button

```tsx
import { Button } from "@shadcn/designer/ui";

function ActionButton() {
  return (
    <Button variant="outline" size="sm">
      Click me
    </Button>
  );
}
```

## InputGroup

Wrap inputs and addons to build compact control clusters with optional scrubbing support.

- `InputGroup` positions addons around the focused input with consistent padding.
- `InputGroupAddon` can enable scrubbing, pulling min/max/step from nearby `InputNumber` fields.
- Use the `enableScrubbing`, `sensitivity`, and `acceleration` props to tune pointer adjustments.

```tsx
import * as React from "react";
import { InputGroup, InputGroupAddon, InputNumber } from "@shadcn/designer/ui";

function SizeField() {
  return (
    <InputGroup>
      <InputGroupAddon>W</InputGroupAddon>
      <InputNumber min={0} defaultValue={1024} step={1} />
    </InputGroup>
  );
}
```

## Input

```tsx
import { Input } from "@shadcn/designer/ui";

function TextInput() {
  return <Input placeholder="Enter text..." />;
}
```

## InputNumber

Number input with increment/decrement controls.

```tsx
import { InputNumber } from "@shadcn/designer/ui";

function NumberInput() {
  return <InputNumber min={0} max={100} step={1} />;
}
```

## Select

```tsx
import { Select } from "@shadcn/designer/ui";

function Dropdown() {
  return (
    <Select>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
    </Select>
  );
}
```

## Textarea

```tsx
import { Textarea } from "@shadcn/designer/ui";

function MultilineInput() {
  return <Textarea placeholder="Enter text..." />;
}
```

## Checkbox

```tsx
import { Checkbox } from "@shadcn/designer/ui";

function CheckboxInput() {
  return <Checkbox>Enable feature</Checkbox>;
}
```

## Slider

```tsx
import { Slider } from "@shadcn/designer/ui";

function RangeSlider() {
  return <Slider min={0} max={100} step={1} />;
}
```

## ColorPicker

```tsx
import { ColorPicker } from "@shadcn/designer/ui";

function ColorSelector() {
  return <ColorPicker value="#ff0000" onValueChange={setColor} />;
}
```

## Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shadcn/designer/ui";

function TabNavigation() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  );
}
```

## Dialog

```tsx
import { Dialog } from "@shadcn/designer/ui";

function ModalDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
```

## Popover

```tsx
import { Popover } from "@shadcn/designer/ui";

function PopoverContent() {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover content</PopoverContent>
    </Popover>
  );
}
```

## DropdownMenu

```tsx
import { DropdownMenu } from "@shadcn/designer/ui";

function ContextDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Item 1</DropdownMenuItem>
        <DropdownMenuItem>Item 2</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Tooltip

```tsx
import { Tooltip } from "@shadcn/designer/ui";

function HelpTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger>Hover me</TooltipTrigger>
      <TooltipContent>Helpful information</TooltipContent>
    </Tooltip>
  );
}
```

## Toggle

```tsx
import { Toggle } from "@shadcn/designer/ui";

function ToggleSwitch() {
  return <Toggle>Toggle me</Toggle>;
}
```

## ToggleGroup

```tsx
import { ToggleGroup } from "@shadcn/designer/ui";

function ToggleButtons() {
  return (
    <ToggleGroup type="single">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  );
}
```

## Skeleton

Loading placeholder component.

```tsx
import { Skeleton } from "@shadcn/designer/ui";

function LoadingState() {
  return <Skeleton className="h-4 w-20" />;
}
```

---

## Other

Other components available in the designer.

## ActionLayerMenu

Context menu for layer operations. Wrap your component in the `ActionLayerMenu` component to show the context menu.

```tsx
import { ActionLayerMenu } from "@shadcn/designer";

function LayerMenu() {
  return (
    <ActionLayerMenu layer={layer}>
      <div />
    </ActionLayerMenu>
  );
}
```

## PaneLayerTree

Layer hierarchy tree view with drag-and-drop support.

```tsx
import { PaneLayerTree } from "@shadcn/designer";

function LayersPanel() {
  return <PaneLayerTree />;
}
```

---

## Hooks

The designer provides a comprehensive set of hooks for managing the state and behavior of the designer. These hooks provide a simple way to access and modify the designer's state, handle user interactions, and manage the design canvas.

## Designer

The core hooks for controlling the designer and the canvas.

### useDesignerAction

Executes designer-level actions like zoom, undo/redo, etc.

```tsx
import { useDesignerAction } from "@shadcn/designer";

function DesignerControls() {
  const designerAction = useDesignerAction();

  return (
    <div>
      <button onClick={() => designerAction("ZOOM_IN")}>Zoom In</button>
      <button onClick={() => designerAction("ZOOM_OUT")}>Zoom Out</button>
      <button onClick={() => designerAction("ZOOM_FIT")}>Fit to Screen</button>
      <button onClick={() => designerAction("ZOOM_RESET")}>Reset Zoom</button>
      <button onClick={() => designerAction("ZOOM_100")}>100%</button>
      <button onClick={() => designerAction("UNSELECT_ALL")}>
        Deselect All
      </button>
      <button onClick={() => designerAction("HISTORY_UNDO")}>Undo</button>
      <button onClick={() => designerAction("HISTORY_REDO")}>Redo</button>
      <button onClick={() => designerAction("REDRAW")}>Redraw Canvas</button>
    </div>
  );
}
```

**Available Actions:**

| Action         | Description                                   |
| -------------- | --------------------------------------------- |
| `ZOOM_IN`      | Increase zoom level by one step               |
| `ZOOM_OUT`     | Decrease zoom level by one step               |
| `ZOOM_RESET`   | Reset zoom to default level and center canvas |
| `ZOOM_100`     | Set zoom to 100%                              |
| `ZOOM_FIT`     | Fit canvas to viewport and center             |
| `REDRAW`       | Redraw the canvas and center it               |
| `UNSELECT_ALL` | Clear all layer selections                    |
| `HISTORY_UNDO` | Trigger undo action                           |
| `HISTORY_REDO` | Trigger redo action                           |

See also `useUndo` and `useRedo` for undo/redo functionality.

### useDesignerTool

Gets the currently active designer tool.

```tsx
import { useDesignerTool } from "@shadcn/designer";

function ToolIndicator() {
  const tool = useDesignerTool();

  return <div>Active tool: {tool === "move" ? "Move Tool" : "Hand Tool"}</div>;
}
```

**Available Tools:**

| Tool   | Description                                  |
| ------ | -------------------------------------------- |
| `move` | Default tool for selecting and moving layers |
| `hand` | Pan the canvas without selecting layers      |

### useSetDesignerTool

Sets the active designer tool.

```tsx
import { useDesignerTool, useSetDesignerTool } from "@shadcn/designer";

function ToolSwitcher() {
  const tool = useDesignerTool();
  const setTool = useSetDesignerTool();

  return (
    <div>
      <button onClick={() => setTool("move")} disabled={tool === "move"}>
        Move Tool (V)
      </button>
      <button onClick={() => setTool("hand")} disabled={tool === "hand"}>
        Hand Tool (H)
      </button>
    </div>
  );
}
```

**Keyboard Shortcuts:**

- **V** - Switch to Move tool
- **H** - Switch to Hand tool

### useFrameSize

Gets the current frame/canvas size.

```tsx
import { useFrameSize } from "@shadcn/designer";

function FrameInfo() {
  const frameSize = useFrameSize();

  return (
    <div>
      Canvas: {frameSize.width} × {frameSize.height}
    </div>
  );
}
```

### useSetFrameSize

Sets the frame/canvas size.

```tsx
import { useSetFrameSize } from "@shadcn/designer";

function FrameSizeControl() {
  const setFrameSize = useSetFrameSize();

  const handlePreset = (width: number, height: number) => {
    setFrameSize({ width, height });
  };

  return (
    <div>
      <button onClick={() => handlePreset(1920, 1080)}>HD</button>
      <button onClick={() => handlePreset(1024, 1024)}>Square</button>
    </div>
  );
}
```

### useZoom

Gets the current zoom level of the canvas.

```tsx
import { useZoom } from "@shadcn/designer";

function ZoomIndicator() {
  const zoom = useZoom();

  return <span>{Math.round(zoom * 100)}%</span>;
}
```

### useSetZoom

Sets the zoom level of the canvas.

```tsx
import { useSetZoom } from "@shadcn/designer";

function ZoomSlider() {
  const zoom = useZoom();
  const setZoom = useSetZoom();

  return (
    <input
      type="range"
      min="0.1"
      max="3"
      step="0.1"
      value={zoom}
      onChange={(e) => setZoom(parseFloat(e.target.value))}
    />
  );
}
```

### useTargets

Gets the current interaction targets on the canvas.

```tsx
import { useTargets } from "@shadcn/designer";

function TargetInfo() {
  const targets = useTargets();

  return <div>Active targets: {targets.length}</div>;
}
```

### useSetTargets

Sets the interaction targets on the canvas.

```tsx
import { useSetTargets, type Target } from "@shadcn/designer";

function TargetController({ newTargets }) {
  const setTargets = useSetTargets();

  React.useEffect(() => {
    const target = document.querySelector(
      `[data-layer-id="SOME_LAYER_ID"].layer`,
    ) as Target | null;
    setTargets([target]);
  }, [setTargets]);

  return null;
}
```

## Layer Management

Essential hooks for working with layers - selecting, creating, modifying, and managing layer state.

### useSelectedLayers

Gets the currently selected layers on the canvas.

```tsx
import { useSelectedLayers } from "@shadcn/designer";

function LayerInfo() {
  const selectedLayers = useSelectedLayers();

  return (
    <div>
      {selectedLayers.length > 0 ? (
        <p>Selected: {selectedLayers[0].name}</p>
      ) : (
        <p>No layers selected</p>
      )}
    </div>
  );
}
```

### useSetSelectedLayers

Sets the selected layers on the canvas.

```tsx
import { useSetSelectedLayers } from "@shadcn/designer";

function LayerSelector({ layer }) {
  const setSelectedLayers = useSetSelectedLayers();

  const handleSelect = () => {
    setSelectedLayers([layer]);
  };

  return <button onClick={handleSelect}>Select Layer</button>;
}
```

### useSelectedLayerIds

Gets an array of IDs for currently selected layers.

```tsx
import { useSelectedLayerIds } from "@shadcn/designer";

function SelectedLayerCount() {
  const selectedLayerIds = useSelectedLayerIds();

  return <span>Selected: {selectedLayerIds.length}</span>;
}
```

### useSelectedLayerTypes

Gets the unique types of currently selected layers.

```tsx
import { useSelectedLayerTypes } from "@shadcn/designer";

function LayerTypeIndicator() {
  const selectedLayerTypes = useSelectedLayerTypes();

  return <div>Types: {selectedLayerTypes.join(", ")}</div>;
}
```

### useLayers

Gets all layers in the design.

```tsx
import { useLayers } from "@shadcn/designer";

function LayerCount() {
  const layers = useLayers();

  return <span>Total layers: {layers.length}</span>;
}
```

To add or remove layers, see [`useAddLayers`](#useaddlayers) and [`useDeleteLayers`](#usedeletelayers).

### useLayersWithStyles

Gets all layers with computed styles applied.

```tsx
import { useLayersWithStyles } from "@shadcn/designer";

function StyledLayerList() {
  const layersWithStyles = useLayersWithStyles();

  return (
    <div>
      {layersWithStyles.map((layer) => (
        <div key={layer.id} style={layer.style}>
          {layer.name}
        </div>
      ))}
    </div>
  );
}
```

### useAddLayers

Adds new layers to the design canvas.

```tsx
import { useAddLayers } from "@shadcn/designer";

function AddTextButton() {
  const addLayers = useAddLayers();

  const handleAddText = () => {
    addLayers([
      {
        type: "text",
        name: "New Text",
        cssVars: {
          "--content": "Hello World",
          "--font-size": "16px",
        },
      },
    ]);
  };

  return <button onClick={handleAddText}>Add Text Layer</button>;
}
```

### useDeleteLayers

Deletes layers from the design canvas.

```tsx
import { useDeleteLayers, useSelectedLayerIds } from "@shadcn/designer";

function DeleteSelectedButton() {
  const deleteLayers = useDeleteLayers();
  const selectedLayerIds = useSelectedLayerIds();

  const handleDelete = () => {
    deleteLayers(selectedLayerIds);
  };

  return (
    <button onClick={handleDelete} disabled={selectedLayerIds.length === 0}>
      Delete Selected
    </button>
  );
}
```

### useGetLayers

Gets specific layers by their IDs.

```tsx
import { useGetLayers } from "@shadcn/designer";

function LayerDetails({ layerIds }) {
  const getLayers = useGetLayers();
  const layers = getLayers(layerIds);

  return (
    <div>
      {layers.map((layer) => (
        <div key={layer.id}>{layer.name}</div>
      ))}
    </div>
  );
}
```

### useSetLayersProperty

Sets a property on multiple layers at once.

```tsx
import { useSetLayersProperty } from "@shadcn/designer";

function LockSelectedLayers() {
  const setLayersProperty = useSetLayersProperty();
  const selectedLayerIds = useSelectedLayerIds();

  const handleLock = () => {
    setLayersProperty(selectedLayerIds, "isLocked", true);
  };

  return <button onClick={handleLock}>Lock Selected</button>;
}
```

See the [Layer](/docs/reference/types#layer) type for more information on the properties that can be set and how to use the `meta` property to store arbitrary data on a layer.

### useLayersAction

Executes common layer actions like duplicate, delete, show/hide, etc.

```tsx
import { useLayersAction, useSelectedLayerIds } from "@shadcn/designer";

function LayerActions() {
  const layersAction = useLayersAction();
  const selectedLayerIds = useSelectedLayerIds();

  const handleDuplicate = () => {
    layersAction("DUPLICATE_LAYER", selectedLayerIds);
  };

  const handleToggleVisibility = () => {
    layersAction("SHOW_HIDE_LAYER", selectedLayerIds);
  };

  return (
    <div>
      <button onClick={handleDuplicate}>Duplicate</button>
      <button onClick={handleToggleVisibility}>Toggle Visibility</button>
    </div>
  );
}
```

**Available Actions:**

| Action              | Description                            |
| ------------------- | -------------------------------------- |
| `DUPLICATE_LAYER`   | Duplicate the selected layers          |
| `SHOW_HIDE_LAYER`   | Show or hide the selected layers       |
| `BRING_TO_FRONT`    | Bring the selected layers to the front |
| `SEND_TO_BACK`      | Send the selected layers to the back   |
| `LOCK_UNLOCK_LAYER` | Lock or unlock the selected layers     |

### useLayerTypes

Gets the available layer types that can be created.

```tsx
import { useLayerTypes } from "@shadcn/designer";

function LayerTypeMenu() {
  const layerTypes = useLayerTypes();

  return (
    <select>
      {layerTypes.map((type) => (
        <option key={type.type} value={type.type}>
          {type.name}
        </option>
      ))}
    </select>
  );
}
```

### useLayerCssVarAction

Manages CSS variables for selected layers with type-safe serialization.

```tsx
// Create a typed CSS variable action
const fontSize = createLayerCssVarAction("--font-size", "16px");
```

You can also pass a `serialize` and `deserialize` function to the `createLayerCssVarAction` function to customize the serialization and deserialization of the value.

```tsx
const fontSize = createLayerCssVarAction("--font-size", "16px", {
  serialize: (value: number) => `${value}px`,
  deserialize: (value: string | undefined) => {
    return value ? parseInt(value) : 16;
  },
});
```

```tsx
import {
  useLayerCssVarAction,
  createLayerCssVarAction,
} from "@shadcn/designer";

// Create a typed CSS variable action
const fontSize = createLayerCssVarAction("--font-size", "16px");

function FontSizeControl() {
  const [value, setValue] = useLayerCssVarAction(fontSize);

  return (
    <input
      type="range"
      min="8"
      max="72"
      value={value}
      onChange={(e) => setValue(parseInt(e.target.value))}
    />
  );
}
```

## History Management

Hooks for managing undo/redo functionality and action history.

### useUndo

Triggers an undo action.

```tsx
import { useUndo, useCanUndo } from "@shadcn/designer";

function UndoButton() {
  const undo = useUndo();
  const canUndo = useCanUndo();

  return (
    <button onClick={undo} disabled={!canUndo}>
      Undo
    </button>
  );
}
```

### useRedo

Triggers a redo action.

```tsx
import { useRedo, useCanRedo } from "@shadcn/designer";

function RedoButton() {
  const redo = useRedo();
  const canRedo = useCanRedo();

  return (
    <button onClick={redo} disabled={!canRedo}>
      Redo
    </button>
  );
}
```

### useCanUndo

Checks if undo is available.

```tsx
import { useCanUndo } from "@shadcn/designer";

function HistoryStatus() {
  const canUndo = useCanUndo();

  return canUndo ? "Changes available" : "No changes to undo";
}
```

### useCanRedo

Checks if redo is available.

```tsx
import { useCanRedo } from "@shadcn/designer";

function RedoStatus() {
  const canRedo = useCanRedo();

  return canRedo ? "Redo available" : "Nothing to redo";
}
```

## Keyboard Shortcuts

Hooks for handling keyboard interactions and custom shortcuts.

### useShortcut

Registers a keyboard shortcut with a callback.

```tsx
import { useShortcut } from "@shadcn/designer";

function ShortcutHandler() {
  useShortcut("DUPLICATE_LAYER", () => {
    console.log("Duplicate shortcut pressed");
  });

  useShortcut("DELETE_LAYER", () => {
    console.log("Delete shortcut pressed");
  });

  return null; // This component just handles shortcuts
}
```

### useKeybindings

Gets the current keybinding configuration.

```tsx
import { useKeybindings } from "@shadcn/designer";

function ShortcutList() {
  const keybindings = useKeybindings();

  return (
    <div>
      {Object.entries(keybindings).map(([key, binding]) => (
        <div key={key}>
          <strong>{binding.name}</strong>: {binding.key}
        </div>
      ))}
    </div>
  );
}
```

### useSetKeybindings

Sets custom keybinding configuration.

```tsx
import { useSetKeybindings } from "@shadcn/designer";

function CustomizeShortcuts() {
  const setKeybindings = useSetKeybindings();

  const handleCustomize = () => {
    setKeybindings({
      DUPLICATE_LAYER: {
        key: "cmd+d",
        name: "Duplicate Layer",
        group: "layer",
      },
      // ... more keybindings
    });
  };

  return <button onClick={handleCustomize}>Customize Shortcuts</button>;
}
```

## Development

Hooks for debugging and development.

### useDebug

Gets the current debug mode state.

```tsx
import { useDebug } from "@shadcn/designer";

function DebugPanel() {
  const debug = useDebug();

  if (!debug) return null;

  return <div>Debug information...</div>;
}
```

### useSetDebug

Sets the debug mode state.

```tsx
import { useSetDebug } from "@shadcn/designer";

function DebugToggle() {
  const debug = useDebug();
  const setDebug = useSetDebug();

  return (
    <button onClick={() => setDebug(!debug)}>
      {debug ? "Disable" : "Enable"} Debug
    </button>
  );
}
```

## Unit System

Hooks for managing measurement units and DPI settings. See the [Unit System](/docs/concepts/unit-system) guide for detailed usage.

### useUnitSystem

Gets the current unit system being used for display.

```tsx
import { useUnitSystem } from "@shadcn/designer";

function UnitDisplay() {
  const unitSystem = useUnitSystem(); // "px" | "mm" | "in" | "cm" | "pt"

  return <span>Current unit: {unitSystem}</span>;
}
```

### useSetUnitSystem

Sets the unit system for displaying values.

```tsx
import { useSetUnitSystem } from "@shadcn/designer";

function UnitSwitcher() {
  const setUnitSystem = useSetUnitSystem();

  return (
    <select onChange={(e) => setUnitSystem(e.target.value)}>
      <option value="px">Pixels</option>
      <option value="mm">Millimeters</option>
      <option value="in">Inches</option>
      <option value="cm">Centimeters</option>
      <option value="pt">Points</option>
    </select>
  );
}
```

### useDPI

Gets the current DPI (dots per inch) setting used for unit conversions.

```tsx
import { useDPI } from "@shadcn/designer";

function DPIIndicator() {
  const dpi = useDPI(); // Default: 96

  return <span>DPI: {dpi}</span>;
}
```

### useSetDPI

Sets the DPI for unit conversions. Common values are 96 for screen and 300 for print.

```tsx
import { useSetDPI } from "@shadcn/designer";

function DPIControl() {
  const setDPI = useSetDPI();

  return (
    <select onChange={(e) => setDPI(Number(e.target.value))}>
      <option value="96">Screen (96 DPI)</option>
      <option value="300">Print (300 DPI)</option>
      <option value="192">Retina (192 DPI)</option>
    </select>
  );
}
```

## Utilities

Helper hooks for cross-platform compatibility and general utilities.

### useIsMac

Detects if the user is on macOS platform, useful for showing platform-specific keyboard shortcuts and UI elements.

```tsx
import { useIsMac } from "@shadcn/designer";

function ShortcutDisplay({ keybinding }) {
  const isMac = useIsMac();

  const label = isMac ? keybinding.labelMac : keybinding.label;

  return <span>{label}</span>;
}
```

---

## Types

TypeScript type definitions for building with the designer

The designer provides a comprehensive set of TypeScript types for type-safe development. These types define the structure of layers, styling properties, keyboard shortcuts, and configuration objects, ensuring proper validation and IntelliSense support throughout your application.

## Layer

The core type representing a design layer on the canvas. Each layer contains metadata, styling, and content information.

```tsx
type Layer = {
  id: string;
  name: string;
  type: string;
  value: string;
  cssVars?: CSSVars;
  meta?: Record<string, unknown>;
  isLocked?: boolean;
};
```

### Properties

| Property   | Type                      | Required | Description                                                  |
| ---------- | ------------------------- | -------- | ------------------------------------------------------------ |
| `id`       | `string`                  | Yes      | Unique identifier for the layer                              |
| `name`     | `string`                  | Yes      | Display name of the layer                                    |
| `type`     | `string`                  | Yes      | Layer type (e.g., "text", "image", "rectangle")              |
| `value`    | `string`                  | Yes      | Layer-specific content/value (e.g., text content, image URL) |
| `cssVars`  | `CSSVars`                 | No       | CSS custom properties for styling                            |
| `meta`     | `Record<string, unknown>` | No       | Arbitrary metadata storage                                   |
| `isLocked` | `boolean`                 | No       | Whether the layer is locked from editing                     |

### Usage Examples

**Basic Layer Creation:**

```tsx
import { type Layer } from "@shadcn/designer";

const textLayer: Layer = {
  id: "layer-1",
  name: "My Text",
  type: "text",
  value: "Hello World",
  cssVars: {
    "--font-size": "24px",
    "--color": "#000000",
  },
};
```

**Layer with Metadata:**

```tsx
const imageLayer: Layer = {
  id: "layer-2",
  name: "Hero Image",
  type: "image",
  value: "/images/hero.jpg",
  meta: {
    alt: "Hero section background",
    uploadedAt: new Date().toISOString(),
    fileSize: 1024000,
  },
  isLocked: true,
};
```

**Working with Layers:**

```tsx
function LayerComponent({ layer }: { layer: Layer }) {
  const displayName = layer.isLocked ? `🔒 ${layer.name}` : layer.name;

  return (
    <div className="layer-item">
      <h3>{displayName}</h3>
      <span className="layer-type">{layer.type}</span>
      {layer.meta?.description && <p>{layer.meta.description as string}</p>}
    </div>
  );
}
```

## LayerWithStyles

Extended layer type that includes computed CSS styles for rendering.

```tsx
type LayerWithStyles = Layer & {
  style: CSSProperties;
  contentStyle: CSSProperties;
};
```

### Additional Properties

| Property       | Type            | Description                             |
| -------------- | --------------- | --------------------------------------- |
| `style`        | `CSSProperties` | Computed styles for the layer container |
| `contentStyle` | `CSSProperties` | Computed styles for the layer content   |

### Usage Example

```tsx
import { type LayerWithStyles } from "@shadcn/designer";

function RenderLayer({ layer }: { layer: LayerWithStyles }) {
  return (
    <div style={layer.style} className="layer">
      <div style={layer.contentStyle} className="layer-content">
        {layer.value}
      </div>
    </div>
  );
}
```

## LayerType

Configuration type that defines how a specific layer type behaves and renders.

```tsx
type LayerType = {
  type: string;
  name: string;
  defaultValues: Omit<Layer, "id" | "type">;
  render: (layer: LayerWithStyles) => React.ReactNode;
  icon?: ReactNode;
  keybinding?: Keybinding;
};
```

### Properties

| Property        | Type                                          | Required | Description                                 |
| --------------- | --------------------------------------------- | -------- | ------------------------------------------- |
| `type`          | `string`                                      | Yes      | Unique type identifier                      |
| `name`          | `string`                                      | Yes      | Human-readable name                         |
| `defaultValues` | `Omit<Layer, "id" \| "type">`                 | Yes      | Default values for new layers               |
| `render`        | `(layer: LayerWithStyles) => React.ReactNode` | Yes      | Render function                             |
| `icon`          | `ReactNode`                                   | No       | Icon for UI (string, component, or element) |
| `keybinding`    | `Keybinding`                                  | No       | Optional keyboard shortcut                  |

### Usage Example

```tsx
import { type LayerType } from "@shadcn/designer";
import { TextIcon } from "lucide-react";

const textLayerType: LayerType = {
  type: "text",
  name: "Text",
  icon: TextIcon, // Can be a React component
  defaultValues: {
    name: "Text",
    value: "Enter text...",
    cssVars: {
      "--font-size": "16px",
      "--color": "#000000",
    },
  },
  render: (layer) => (
    <div style={layer.style}>
      <span style={layer.contentStyle}>{layer.value}</span>
    </div>
  ),
  keybinding: {
    key: "t",
    label: "T",
    labelMac: "T",
    description: "Add text layer",
    group: "layer",
  },
};

// You can also use strings (including emojis)
const blobLayerType: LayerType = {
  type: "blob",
  name: "Blob",
  icon: "🍡", // Can be a string or emoji
  defaultValues: {
    name: "Blob",
    value: "",
  },
  render: (layer) => <div>Blob content</div>,
};

// Or JSX elements
const customLayerType: LayerType = {
  type: "custom",
  name: "Custom",
  icon: <span className="text-blue-500">★</span>, // Can be JSX
  defaultValues: {
    name: "Custom",
    value: "",
  },
  render: (layer) => <div>Custom content</div>,
};
```

## Keybinding

Configuration type for keyboard shortcuts.

```tsx
type Keybinding = {
  key: string;
  label: string;
  labelMac: string;
  description: string;
  group: string;
};
```

### Properties

| Property      | Type     | Description                                     |
| ------------- | -------- | ----------------------------------------------- |
| `key`         | `string` | Keyboard combination (e.g., "cmd+d", "shift+t") |
| `label`       | `string` | Display label for non-Mac platforms             |
| `labelMac`    | `string` | Display label for Mac platforms                 |
| `description` | `string` | Human-readable description                      |
| `group`       | `string` | Category/group for organization                 |

### Usage Example

```tsx
import { type Keybinding } from "@shadcn/designer";

const duplicateKeybinding: Keybinding = {
  key: "cmd+d",
  label: "Ctrl+D",
  labelMac: "⌘D",
  description: "Duplicate selected layers",
  group: "layer",
};
```

## CSSVars

Type for CSS custom properties used in layer styling.

```tsx
type CSSVars = Record<string, string>;
```

### Usage Example

```tsx
import { type CSSVars } from "@shadcn/designer";

const layerStyles: CSSVars = {
  "--width": "200px",
  "--height": "100px",
  "--background": "#f0f0f0",
  "--border-radius": "8px",
  "--font-size": "16px",
  "--color": "#333333",
};
```

## FrameSize

Configuration type that defines the canvas frame dimensions.

```tsx
type FrameSize = {
  width: number;
  height: number;
  unit?: Unit;
};
```

### Properties

| Property | Type     | Required | Description                            |
| -------- | -------- | -------- | -------------------------------------- |
| `width`  | `number` | Yes      | Frame width value                      |
| `height` | `number` | Yes      | Frame height value                     |
| `unit`   | `Unit`   | No       | Unit of measurement (defaults to "px") |

### Usage Example

```tsx
import { type FrameSize } from "@shadcn/designer";

const frameSize: FrameSize = {
  width: 1920,
  height: 1080,
  unit: "px",
};

// Print dimensions (8.5" x 11")
const printFrame: FrameSize = {
  width: 8.5,
  height: 11,
  unit: "in",
};
```

## Unit

Type representing supported measurement units in the designer.

```tsx
type Unit = "px" | "mm" | "in" | "cm" | "pt";
```

### Supported Units

| Unit | Description | Common Use Case                    |
| ---- | ----------- | ---------------------------------- |
| `px` | Pixels      | Screen designs, web layouts        |
| `mm` | Millimeters | Print designs, physical dimensions |
| `in` | Inches      | Print designs, physical dimensions |
| `cm` | Centimeters | Print designs, physical dimensions |
| `pt` | Points      | Typography, print designs          |

### Usage Example

```tsx
import { type Unit } from "@shadcn/designer";

const currentUnit: Unit = "px";

// Unit conversion utilities are also available
import { convertUnit, toPixels, fromPixels } from "@shadcn/designer";

// Convert 25.4mm to pixels at 96 DPI
const pixels = toPixels(25.4, "mm", 96); // 96px

// Convert 100px to inches at 96 DPI
const inches = fromPixels(100, "in", 96); // ~1.04in
```
