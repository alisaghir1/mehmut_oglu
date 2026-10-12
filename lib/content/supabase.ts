import type { SupabaseClient } from "@supabase/supabase-js";
import type { Localized, SiteContent } from "./types";
import { seedContent } from "./seed";

type Row = Record<string, unknown>;
const L = (v: unknown): Localized => (v && typeof v === "object" ? (v as Localized) : { en: String(v ?? ""), tr: "" });
const S = (v: unknown) => String(v ?? "");
const N = (v: unknown) => Number(v ?? 0);

/** Load every content table with the anon client (public RLS) and map to the domain model. */
export async function loadContentFromSupabase(sb: SupabaseClient): Promise<SiteContent> {
  const [settings, hero, sections, about, team, cats, items, services, gallery, posts] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("hero_slides").select("*").eq("is_active", true).order("sort_order"),
    sb.from("sections").select("*"),
    sb.from("about").select("*").eq("id", 1).maybeSingle(),
    sb.from("team_members").select("*").eq("is_active", true).order("sort_order"),
    sb.from("menu_categories").select("*").eq("is_active", true).order("sort_order"),
    sb.from("menu_items").select("*").order("sort_order"),
    sb.from("services").select("*").eq("is_active", true).order("sort_order"),
    sb.from("gallery_images").select("*").eq("is_active", true).order("sort_order"),
    sb.from("posts").select("*").eq("is_published", true).order("published_at", { ascending: false }),
  ]);

  const firstError = [settings, hero, sections, about, team, cats, items, services, gallery, posts].find((r) => r.error)?.error;
  if (firstError) throw firstError;
  // Empty project (migrations not yet run) → let the caller fall back to the seed.
  if (!settings.data) throw new Error("site_settings row missing");

  const s = settings.data as Row;
  const a = (about.data ?? {}) as Row;

  return {
    settings: {
      name: S(s.name),
      tagline: L(s.tagline),
      description: L(s.description),
      foundedYear: N(s.founded_year),
      phone: S(s.phone),
      email: S(s.email),
      address: L(s.address),
      hours: L(s.hours),
      mapEmbedUrl: S(s.map_embed_url),
      social: (s.social as SiteContent["settings"]["social"]) ?? {},
    },
    heroSlides: ((hero.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      sortOrder: N(r.sort_order),
      eyebrow: L(r.eyebrow),
      title: L(r.title),
      image: S(r.image),
      imageAlt: L(r.image_alt),
    })),
    sections: Object.fromEntries(
      ((sections.data ?? []) as Row[]).map((r) => [
        S(r.key),
        { key: S(r.key), eyebrow: L(r.eyebrow), title: L(r.title), isEnabled: Boolean(r.is_enabled) },
      ]),
    ),
    about: {
      paragraphs: Array.isArray(a.paragraphs) ? (a.paragraphs as Localized[]) : seedContent.about.paragraphs,
      images: [S(a.image_1) || seedContent.about.images[0], S(a.image_2) || seedContent.about.images[1]],
      counterValue: N(a.counter_value) || seedContent.about.counterValue,
      counterLabel: L(a.counter_label ?? seedContent.about.counterLabel),
      quote: L(a.quote ?? seedContent.about.quote),
      quoteAuthor: S(a.quote_author ?? seedContent.about.quoteAuthor),
    },
    team: ((team.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      sortOrder: N(r.sort_order),
      name: S(r.name),
      role: L(r.role),
      image: S(r.image),
    })),
    menuCategories: ((cats.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      slug: S(r.slug),
      sortOrder: N(r.sort_order),
      name: L(r.name),
    })),
    menuItems: ((items.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      categoryId: S(r.category_id),
      sortOrder: N(r.sort_order),
      name: L(r.name),
      description: L(r.description),
      price: N(r.price),
      currency: S(r.currency) || "€",
      image: S(r.image),
      isAvailable: Boolean(r.is_available),
    })),
    services: ((services.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      sortOrder: N(r.sort_order),
      title: L(r.title),
      description: L(r.description),
      image: S(r.image),
    })),
    gallery: ((gallery.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      sortOrder: N(r.sort_order),
      image: S(r.image),
      caption: L(r.caption),
      width: N(r.width) || 1600,
      height: N(r.height) || 1200,
    })),
    posts: ((posts.data ?? []) as Row[]).map((r) => ({
      id: S(r.id),
      slug: S(r.slug),
      publishedAt: S(r.published_at),
      title: L(r.title),
      excerpt: L(r.excerpt),
      body: L(r.body),
      coverImage: S(r.cover_image),
      gallery: Array.isArray(r.gallery) ? (r.gallery as string[]) : [],
    })),
  };
}
