"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Client-only "now" values. The server snapshot is `null`, so prerendering stays
 * deterministic and the real value fills in after hydration.
 */
export function useClientDate<T>(select: (now: Date) => T): T | null {
  return useSyncExternalStore(subscribe, () => select(new Date()), () => null);
}
