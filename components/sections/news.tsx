import Image from "next/image";
import { getFormatter, getTranslations } from "next-intl/server";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight } from "@/components/ui/icons";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { t, type Post, type SectionHeading as Heading } from "@/lib/content/types";

interface NewsProps {
  heading: Heading;
  posts: Post[];
  locale: Locale;
}

/* Dinex news-bg-1..4 radii: plain, plain, 0 50 0 0, 0 0 0 50 */
const RADII = ["", "", "rounded-tr-feature", "rounded-bl-feature"];

export async function News({ heading, posts, locale }: NewsProps) {
  const tn = await getTranslations({ locale, namespace: "news" });
  const format = await getFormatter({ locale });
  const latest = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);

  return (
    <section id="news" className="section-frame bg-ink-850 scroll-mt-20">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />
        <div className="divider-l" />

        <Stagger className="grid gap-6 md:grid-cols-2" stagger={0.12}>
          {latest.map((post, i) => (
            <StaggerItem key={post.id}>
              <Link
                href={`/news/${post.slug}`}
                className={`group relative block aspect-[4/3] overflow-hidden bg-ink-700 md:aspect-[16/10] ${RADII[i] ?? ""}`}
              >
                <Image
                  src={post.coverImage}
                  alt={t(post.title, locale)}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/60 to-ink-950/25 transition-opacity duration-700 group-hover:opacity-90" />
                {/* Dinex .news-txt — centred copy block */}
                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <time
                    dateTime={post.publishedAt}
                    className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-sand"
                  >
                    {format.dateTime(new Date(post.publishedAt), { dateStyle: "long" })}
                  </time>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] text-cream md:text-3xl">
                    {t(post.title, locale)}
                  </h3>
                  <p className="mt-2 line-clamp-2 max-w-xl text-[14px] text-parchment/80">{t(post.excerpt, locale)}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-parchment">
                    {tn("readMore")}
                    <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <div className="divider-xl" />
    </section>
  );
}
