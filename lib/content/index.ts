import { cacheLife, cacheTag } from "next/cache";
import { createAnonClient } from "@/lib/supabase/server";
import type { SiteContent } from "./types";
import { seedContent } from "./seed";
import { loadContentFromSupabase } from "./supabase";

export const SITE_CONTENT_TAG = "site-content";

/**
 * Content access layer. Reads from Supabase when configured, otherwise (or on
 * error / empty project) serves the bundled demo seed so the site always renders.
 * Cached as part of the static shell and invalidated via `updateTag(SITE_CONTENT_TAG)`
 * from admin Server Actions.
 */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(SITE_CONTENT_TAG);
  cacheLife("days");

  const sb = createAnonClient();
  if (!sb) return seedContent;
  try {
    return await loadContentFromSupabase(sb);
  } catch (err) {
    console.warn("[content] Supabase unavailable, serving seed:", err instanceof Error ? err.message : err);
    return seedContent;
  }
}

export async function getPostBySlug(slug: string) {
  const content = await getSiteContent();
  return content.posts.find((p) => p.slug === slug) ?? null;
}

export * from "./types";
