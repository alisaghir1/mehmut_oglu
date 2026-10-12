import { routing } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** hreflang map for a path (without locale prefix), plus x-default. */
export function languageAlternates(path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const entries = routing.locales.map((l) => [l, `${SITE_URL}/${l}${clean === "/" ? "" : clean}`]);
  entries.push(["x-default", `${SITE_URL}/${routing.defaultLocale}${clean === "/" ? "" : clean}`]);
  return Object.fromEntries(entries);
}
