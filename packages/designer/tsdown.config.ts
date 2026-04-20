import { cp } from "node:fs/promises";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    ui: "./src/ui/index.ts",
    utils: "./src/utils/index.ts",
    static: "./src/static/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    /^react\//,
    /^react-dom\//,
    "alien-signals",
    "mutative",
    "zustand",
    /^zustand\//,
    "use-sync-external-store",
    /^use-sync-external-store\//,
    "clsx",
    "tailwind-merge",
  ],
  outputOptions: {
    preserveModules: false,
    exports: "named",
  },
  platform: "neutral",
  hooks: {
    "build:done": async () => {
      // Phase 0: just copy the raw stub so the exports map resolves.
      // Phase 13 will replace this with a Tailwind v4 CLI build step.
      await cp("./src/styles.css", "./dist/styles.css");
    },
  },
});
