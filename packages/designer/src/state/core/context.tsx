"use client";

/**
 * React context plumbing for the designer store.
 *
 * Every hook in `src/hooks/` resolves the store from this context. The
 * context is created once at module load but the store itself is created
 * per `<Designer>` instance (see `canvas/Designer.tsx`).
 */

import { createContext, useContext } from "react";
import type { DesignerStore } from "./createStore.ts";

export const DesignerStoreContext = createContext<DesignerStore | null>(null);
DesignerStoreContext.displayName = "DesignerStoreContext";

export function useDesignerStore(): DesignerStore {
  const store = useContext(DesignerStoreContext);
  if (!store) {
    throw new Error(
      "@inedge/designer: hook called outside a <Designer> tree. " +
        "Make sure your component is rendered inside <Designer>.",
    );
  }
  return store;
}
