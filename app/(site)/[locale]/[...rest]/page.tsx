import { notFound } from "next/navigation";

// This segment only ever throws notFound(); nothing to validate for instant navigation.
export const instant = false;

/** Catch-all so unmatched URLs under a locale render the localised not-found page. */
export default function CatchAllPage() {
  notFound();
}
