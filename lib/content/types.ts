import type { Locale } from "@/i18n/routing";

/** Bilingual text stored as JSONB `{ en, tr }` in Postgres. */
export type Localized = Record<Locale, string>;

export interface SiteSettings {
  name: string;
  tagline: Localized;
  description: Localized;
  foundedYear: number;
  phone: string;
  email: string;
  address: Localized;
  hours: Localized;
  mapEmbedUrl: string;
  social: { facebook?: string; instagram?: string; twitter?: string };
}

export interface HeroSlide {
  id: string;
  sortOrder: number;
  eyebrow: Localized;
  title: Localized;
  image: string;
  imageAlt: Localized;
}

export interface SectionHeading {
  key: string;
  eyebrow: Localized;
  title: Localized;
  isEnabled: boolean;
}

export interface AboutContent {
  paragraphs: Localized[];
  images: [string, string];
  counterValue: number;
  counterLabel: Localized;
  quote: Localized;
  quoteAuthor: string;
}

export interface TeamMember {
  id: string;
  sortOrder: number;
  name: string;
  role: Localized;
  image: string;
}

export interface MenuCategory {
  id: string;
  slug: string;
  sortOrder: number;
  name: Localized;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  sortOrder: number;
  name: Localized;
  description: Localized;
  price: number;
  currency: string;
  image: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  sortOrder: number;
  title: Localized;
  description: Localized;
  image: string;
}

export interface GalleryImage {
  id: string;
  sortOrder: number;
  image: string;
  caption: Localized;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  slug: string;
  publishedAt: string;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  coverImage: string;
  gallery: string[];
}

export interface SiteContent {
  settings: SiteSettings;
  heroSlides: HeroSlide[];
  sections: Record<string, SectionHeading>;
  about: AboutContent;
  team: TeamMember[];
  menuCategories: MenuCategory[];
  menuItems: MenuItem[];
  services: Service[];
  gallery: GalleryImage[];
  posts: Post[];
}

/** Resolve a bilingual field for a locale, falling back to English. */
export function t(value: Localized | undefined, locale: Locale): string {
  if (!value) return "";
  return value[locale] || value.en || "";
}
