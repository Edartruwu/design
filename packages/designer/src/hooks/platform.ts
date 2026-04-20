"use client";

import { useSyncExternalStore } from "react";

function getIsMac(): boolean {
  if (typeof navigator === "undefined") return false;
  // @ts-expect-error — userAgentData is Chromium-only but widely shimmed.
  const platform = navigator.userAgentData?.platform ?? navigator.platform ?? "";
  return /mac/i.test(platform);
}

// Platform is stable across a session; we can cache and never notify.
const subscribe = (_: () => void) => () => {};
const getSnapshot = () => getIsMac();

export function useIsMac(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
