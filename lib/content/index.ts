import { cacheLife, cacheTag } from "next/cache";
import type { SiteContent } from "./types";
import { seedContent } from "./seed";

export const SITE_CONTENT_TAG = "site-content";

/**
 * Content access layer. Phase 3 serves the bundled seed; Phase 4 swaps the
 * body to Supabase (with the seed as fallback) without touching any component.
 * Cached as part of the static shell and invalidated via `updateTag(SITE_CONTENT_TAG)`
 * from admin Server Actions.
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);
  cacheLife("days");
  return seedContent;
}

export async function getPostBySlug(slug: string) {
  const content = await getSiteContent();
  return content.posts.find((p) => p.slug === slug) ?? null;
}

export * from "./types";
