import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, Stagger, StaggerItem, scaleIn } from "@/components/motion/reveal";
import { ArrowLeft, ArrowRight } from "@/components/ui/icons";
import { PageHero } from "@/components/ui/page-hero";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getPostBySlug, getSiteContent, t } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// Unknown slugs must return a real 404 status, so this route is allowed to block
// (all known posts are prerendered via generateStaticParams, so this rarely matters).
export const instant = false;

export async function generateStaticParams() {
  const { posts } = await getSiteContent();
  return routing.locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = t(post.title, locale);
  const description = t(post.excerpt, locale);
  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      images: [{ url: post.coverImage }],
    },
    alternates: {
      canonical: `/${locale}/news/${slug}`,
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/news/${slug}`])),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [{ posts, settings }, tn, format] = await Promise.all([
    getSiteContent(),
    getTranslations({ locale, namespace: "news" }),
    getFormatter({ locale }),
  ]);
  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const index = sorted.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = sorted[index];
  const prev = sorted[index + 1];
  const next = sorted[index - 1];
  const date = format.dateTime(new Date(post.publishedAt), { dateStyle: "long" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: t(post.title, locale),
    description: t(post.excerpt, locale),
    image: [post.coverImage, ...post.gallery],
    datePublished: post.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: settings.name },
    publisher: { "@type": "Organization", name: settings.name, logo: { "@type": "ImageObject", url: "/brand/logo-512.png" } },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={date}
        title={t(post.title, locale)}
        image={post.coverImage}
        meta={
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-sand hover:text-cream"
          >
            <ArrowLeft size={14} /> {tn("backToNews")}
          </Link>
        }
      />

      <article className="section-frame bg-ink-850">
        <div className="divider-l" />
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <p className="text-lg !text-parchment">{t(post.excerpt, locale)}</p>
          </Reveal>
          <div className="divider-m" />
          <div className="hairline" />
          <div className="divider-m" />
          <Reveal delay={0.1} className="space-y-6">
            {t(post.body, locale)
              .split(/\n{2,}/)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </Reveal>
        </div>

        {post.gallery.length > 0 && (
          <>
            <div className="divider-xl" />
            <div className="mx-auto max-w-[1200px] px-6">
              <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
                {post.gallery.map((src, i) => (
                  <StaggerItem key={src + i} variants={scaleIn}>
                    <div
                      className={`relative aspect-[4/5] overflow-hidden bg-ink-700 ${
                        i % 3 === 0 ? "rounded-tr-feature" : i % 3 === 2 ? "rounded-bl-feature" : "rounded-card"
                      }`}
                    >
                      <Image src={src} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </>
        )}

        <div className="divider-xl" />
        <nav aria-label="Post navigation" className="mx-auto flex max-w-[1200px] items-stretch justify-between gap-6 px-6">
          {prev ? (
            <Link href={`/news/${prev.slug}`} className="group flex-1 border-t border-parchment/15 pt-6 text-left">
              <span className="inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-sand group-hover:text-cream">
                <ArrowLeft size={14} /> {tn("readMore")}
              </span>
              <span className="mt-3 block font-display text-xl font-bold tracking-[-0.03em] text-cream">{t(prev.title, locale)}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link href={`/news/${next.slug}`} className="group flex-1 border-t border-parchment/15 pt-6 text-right">
              <span className="inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-sand group-hover:text-cream">
                {tn("readMore")} <ArrowRight size={14} />
              </span>
              <span className="mt-3 block font-display text-xl font-bold tracking-[-0.03em] text-cream">{t(next.title, locale)}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
        <div className="divider-xl" />
      </article>
    </>
  );
}
