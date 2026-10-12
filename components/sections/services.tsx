import Image from "next/image";
import { Reveal, scaleIn } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { t, type SectionHeading as Heading, type Service } from "@/lib/content/types";

interface ServicesProps {
  heading: Heading;
  services: Service[];
  locale: Locale;
}

/** Dinex #services + #benefits/#offers: alternating half-image / half-copy rows. */
export function Services({ heading, services, locale }: ServicesProps) {
  return (
    <section id="services" className="section-frame bg-ink-850 scroll-mt-20">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />
      </div>
      <div className="divider-l" />

      <div className="mx-auto flex max-w-[1400px] flex-col gap-20 px-6 md:gap-0 md:px-10">
        {services.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <article
              key={s.id}
              className={`flex flex-col items-stretch md:flex-row ${flip ? "md:flex-row-reverse" : ""}`}
            >
              <Reveal variants={scaleIn} className="relative md:w-1/2">
                <div
                  className={`group relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[560px] ${
                    flip ? "rounded-bl-feature" : "rounded-tr-feature"
                  }`}
                >
                  <Image
                    src={s.image}
                    alt={t(s.title, locale)}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-ink-950/10 transition-colors duration-1000 group-hover:bg-transparent" />
                </div>
              </Reveal>

              <Reveal delay={0.15} className="flex md:w-1/2 md:items-center">
                <div className={`w-full px-2 py-10 md:px-16 lg:px-24 ${flip ? "md:text-right" : ""}`}>
                  <p className="font-display text-[11px] font-bold tracking-[0.3em] text-oxblood-light">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div className="divider-s" />
                  <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-cream lg:text-4xl">
                    {t(s.title, locale)}
                  </h3>
                  <div className="divider-m" />
                  <div className={`hairline w-24 ${flip ? "md:ml-auto" : ""}`} />
                  <div className="divider-m" />
                  <p>{t(s.description, locale)}</p>
                </div>
              </Reveal>
            </article>
          );
        })}
      </div>
      <div className="divider-xl" />
    </section>
  );
}
