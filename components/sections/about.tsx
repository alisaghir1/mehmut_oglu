import { Reveal, Stagger, StaggerItem, fade, scaleIn } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { t, type AboutContent, type SectionHeading as Heading } from "@/lib/content/types";

interface AboutProps {
  heading: Heading;
  about: AboutContent;
  locale: Locale;
}

export function About({ heading, about, locale }: AboutProps) {
  return (
    <section id="about" className="section-frame bg-ink-850 scroll-mt-20">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />

        <div className="divider-l" />
        <Reveal variants={fade}>
          <div className="the-line" aria-hidden />
        </Reveal>
        <div className="divider-l" />

        {/* Dinex .testimonial blockquote — 35px Playfair, line-height 1.75 */}
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-center font-display text-quote font-medium text-parchment">
            {t(about.quote, locale)}
            <footer className="mt-6 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-sand">
              — {about.quoteAuthor}
            </footer>
          </blockquote>
        </Reveal>

        <div className="divider-l" />
        <Stagger className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2" stagger={0.15}>
          {about.paragraphs.map((p, i) => (
            <StaggerItem key={i}>
              <p>{t(p, locale)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="divider-xl" />

      {/* Dinex .halves-about — two 50% images, asymmetric 50px radii, second offset by 80px */}
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 md:flex-row md:gap-0 md:px-10">
        <Reveal variants={scaleIn} className="md:flex-1">
          <ParallaxImage
            src={about.images[0]}
            alt={t(heading.title, locale)}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] rounded-tr-feature md:aspect-auto md:min-h-[650px]"
          />
        </Reveal>
        <Reveal variants={scaleIn} delay={0.15} className="md:flex-1 md:pt-20">
          <ParallaxImage
            src={about.images[1]}
            alt={t(heading.title, locale)}
            sizes="(min-width: 768px) 50vw, 100vw"
            range={-50}
            className="aspect-[4/5] rounded-bl-feature md:aspect-auto md:min-h-[650px]"
          />
        </Reveal>
      </div>

      {/* Dinex .intro-years — 150px counter */}
      <div className="divider-xl" />
      <Reveal className="text-center">
        <div className="the-line" aria-hidden />
        <div className="divider-m" />
        <p className="font-display text-label font-semibold uppercase tracking-[-0.02em] text-sand">
          {t(about.counterLabel, locale)}
        </p>
        <div className="divider-s" />
        <p className="font-display text-[clamp(5rem,12vw,9.375rem)] font-bold leading-none tracking-[-0.02em] text-cream">
          <CountUp value={about.counterValue} />
        </p>
        <div className="divider-m" />
        <div className="the-line" aria-hidden />
      </Reveal>
      <div className="divider-xl" />
    </section>
  );
}
