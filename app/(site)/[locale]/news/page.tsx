import type { Metadata } from "next";
import Image from "next/image";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { ArrowRight } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getSiteContent, t } from "@/lib/content";
import { SITE_URL, languageAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: tm("newsTitle") },
    alternates: {
      canonical: `${SITE_URL}/${locale}/news`,
      languages: languageAlternates("/news"),
    },
    openGraph: { title: tm("newsTitle"), url: `${SITE_URL}/${locale}/news` },
  };
}

export default async function NewsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [{ posts, sections }, tn, format] = await Promise.all([
    getSiteContent(),
    getTranslations({ locale, namespace: "news" }),
    getFormatter({ locale }),
  ]);
  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const heading = sections.news;

  return (
    <>
      <PageHero
        eyebrow={t(heading.eyebrow, locale)}
        title={t(heading.title, locale)}
        image={sorted[0]?.coverImage ?? "/images/brand/interior-dining-room.webp"}
      />
      <section className="section-frame bg-ink-850">
        <div className="divider-l" />
        <div className="mx-auto max-w-[1200px] px-6">
          <Stagger className="grid gap-x-10 gap-y-20 md:grid-cols-2" stagger={0.12}>
            {sorted.map((post, i) => (
              <StaggerItem key={post.id}>
                <article className="group">
                  <Link
                    href={`/news/${post.slug}`}
                    className={`relative block aspect-[16/10] overflow-hidden bg-ink-700 ${
                      i % 2 === 0 ? "rounded-tr-feature" : "rounded-bl-feature"
                    }`}
                  >
                    <Image
                      src={post.coverImage}
                      alt={t(post.title, locale)}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                    />
                  </Link>
                  <div className="pt-8">
                    <time dateTime={post.publishedAt} className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-sand">
                      {format.dateTime(new Date(post.publishedAt), { dateStyle: "long" })}
                    </time>
                    <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-cream">
                      <Link href={`/news/${post.slug}`} className="hover:text-parchment">
                        {t(post.title, locale)}
                      </Link>
                    </h2>
                    <p className="mt-4">{t(post.excerpt, locale)}</p>
                    <Link
                      href={`/news/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-parchment hover:text-cream"
                    >
                      {tn("readMore")}
                      <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div className="divider-xl" />
      </section>
    </>
  );
}
