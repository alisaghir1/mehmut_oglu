import { setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Interior } from "@/components/sections/interior";
import { Menu } from "@/components/sections/menu";
import { News } from "@/components/sections/news";
import { ParallaxBand } from "@/components/sections/parallax-band";
import { Services } from "@/components/sections/services";
import { Team } from "@/components/sections/team";
import type { Locale } from "@/i18n/routing";
import { getSiteContent, t } from "@/lib/content";
import { restaurantJsonLd } from "@/lib/json-ld";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const c = await getSiteContent();
  const s = c.sections;
  const sorted = <T extends { sortOrder: number }>(arr: T[]) => [...arr].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd(c, locale)) }} />
      <Hero slides={sorted(c.heroSlides)} />
      {s.about?.isEnabled && <About heading={s.about} about={c.about} locale={locale} />}
      {s.team?.isEnabled && <Team heading={s.team} team={sorted(c.team)} locale={locale} />}
      {s.menu?.isEnabled && (
        <Menu heading={s.menu} categories={sorted(c.menuCategories)} items={c.menuItems} />
      )}
      {s.services?.isEnabled && <Services heading={s.services} services={sorted(c.services)} locale={locale} />}
      <ParallaxBand
        image="/images/brand/storefront-mall.webp"
        alt={c.settings.name}
        eyebrow={`${c.settings.foundedYear}`}
        title={t(c.settings.description, locale)}
      />
      {s.interior?.isEnabled && <Interior heading={s.interior} gallery={sorted(c.gallery)} />}
      {s.news?.isEnabled && <News heading={s.news} posts={c.posts} locale={locale} />}
      <Contact
        headings={{ contact: s.contact, reservation: s.reservation, location: s.location }}
        settings={c.settings}
        locale={locale}
      />
    </>
  );
}
