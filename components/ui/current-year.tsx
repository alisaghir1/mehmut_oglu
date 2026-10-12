"use client";

import { useClientDate } from "@/lib/hooks/use-client-date";

/** Current year rendered on the client so the static shell stays prerenderable. */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useClientDate((d) => d.getFullYear());
  return <>{year ?? fallback}</>;
}
