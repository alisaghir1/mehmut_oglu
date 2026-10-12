import type { Locale } from "@/i18n/routing";
import { t, type SiteContent } from "@/lib/content/types";
import { SITE_URL } from "@/lib/seo";

/** schema.org Restaurant + Menu, built from live content. */
export function restaurantJsonLd(c: SiteContent, locale: Locale) {
  const { settings } = c;
  const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_URL}/#restaurant`,
    name: settings.name,
    alternateName: t(settings.tagline, locale),
    description: t(settings.description, locale),
    url: `${SITE_URL}/${locale}`,
    image: c.heroSlides.slice(0, 3).map((h) => abs(h.image)),
    logo: `${SITE_URL}/brand/logo-512.png`,
    telephone: settings.phone,
    email: settings.email,
    servesCuisine: ["Turkish", "Döner", "Kebab"],
    priceRange: "€€",
    foundingDate: String(settings.foundedYear),
    address: { "@type": "PostalAddress", streetAddress: t(settings.address, locale), addressCountry: "TR" },
    acceptsReservations: "True",
    sameAs: Object.values(settings.social).filter(Boolean),
    hasMenu: {
      "@type": "Menu",
      name: t(c.sections.menu?.title, locale) || "Menu",
      inLanguage: locale,
      hasMenuSection: c.menuCategories.map((cat) => ({
        "@type": "MenuSection",
        name: t(cat.name, locale),
        hasMenuItem: c.menuItems
          .filter((i) => i.categoryId === cat.id && i.isAvailable)
          .map((i) => ({
            "@type": "MenuItem",
            name: t(i.name, locale),
            description: t(i.description, locale),
            image: abs(i.image),
            offers: { "@type": "Offer", price: i.price.toFixed(2), priceCurrency: i.currency === "€" ? "EUR" : i.currency === "₺" ? "TRY" : "EUR" },
          })),
      })),
    },
  };
}
