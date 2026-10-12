import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteContent } from "@/lib/content";
import { SITE_URL, languageAlternates } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await getSiteContent();
  const paths = ["/", "/news", ...posts.map((p) => `/news/${p.slug}`)];

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/news" ? 0.7 : 0.6,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
