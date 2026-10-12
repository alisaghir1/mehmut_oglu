"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { t, type MenuCategory, type MenuItem, type SectionHeading as Heading } from "@/lib/content/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface MenuProps {
  heading: Heading;
  categories: MenuCategory[];
  items: MenuItem[];
}

export function Menu({ heading, categories, items }: MenuProps) {
  const locale = useLocale() as Locale;
  const tm = useTranslations("menu");
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const [lightbox, setLightbox] = useState<number>(-1);

  const visible = useMemo(
    () => items.filter((i) => i.categoryId === activeId).sort((a, b) => a.sortOrder - b.sortOrder),
    [items, activeId],
  );

  const fmt = (item: MenuItem) =>
    `${item.currency}${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(item.price)}`;

  return (
    <section id="menu" className="section-frame bg-ink-900 scroll-mt-20">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1200px] px-6">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />
        <div className="divider-l" />
        <Reveal>
          <div className="the-line" aria-hidden />
        </Reveal>
        <div className="divider-l" />

        {/* Dinex .item-selector — Playfair 15/800 uppercase tabs */}
        <Reveal>
          <LayoutGroup id="menu-tabs">
            <div
              role="tablist"
              aria-label={tm("tabs")}
              className="no-scrollbar -mx-6 flex justify-start gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:justify-center md:px-0"
            >
              {categories.map((c) => {
                const selected = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    id={`tab-${c.slug}`}
                    aria-selected={selected}
                    aria-controls={`panel-${c.slug}`}
                    onClick={() => setActiveId(c.id)}
                    className={`relative shrink-0 px-5 py-3 font-display text-label font-extrabold uppercase leading-none transition-colors duration-500 ${
                      selected ? "text-cream" : "text-sand hover:text-parchment"
                    }`}
                  >
                    {t(c.name, locale)}
                    {selected && (
                      <motion.span
                        layoutId="menu-tab-underline"
                        transition={{ duration: 0.5, ease: EASE }}
                        className="absolute inset-x-5 -bottom-0.5 h-px bg-oxblood-light"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        <div className="divider-l" />

        {/* Dinex .menu-visible — 2-column grid; items: 80px round thumb + name — leader — price */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeId}
            role="tabpanel"
            id={`panel-${categories.find((c) => c.id === activeId)?.slug}`}
            aria-labelledby={`tab-${categories.find((c) => c.id === activeId)?.slug}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
              exit: { opacity: 0, transition: { duration: 0.25 } },
            }}
            className="grid gap-x-16 gap-y-2 md:grid-cols-2"
          >
            {visible.map((item, i) => (
              <motion.article
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
                className={`group ${item.isAvailable ? "" : "opacity-50"}`}
              >
                <div className="flex items-baseline">
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={tm("viewImage", { name: t(item.name, locale) })}
                    className="relative mr-4 h-20 w-20 shrink-0 self-start overflow-hidden rounded-full ring-1 ring-parchment/10 transition-all duration-700 group-hover:ring-oxblood-light"
                  >
                    <Image
                      src={item.image}
                      alt={t(item.name, locale)}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </button>
                  <h3 className="font-display text-label font-extrabold uppercase text-parchment">
                    {t(item.name, locale)}
                  </h3>
                  <span className="leader-dashed" aria-hidden />
                  <span className="font-display text-label font-extrabold uppercase text-oxblood-light">
                    {item.isAvailable ? fmt(item) : tm("unavailable")}
                  </span>
                </div>
                <p className="mb-12 mt-2 pl-24 text-[14px]">{t(item.description, locale)}</p>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="divider-xl" />

      <Lightbox
        open={lightbox >= 0}
        index={lightbox}
        close={() => setLightbox(-1)}
        slides={visible.map((i) => ({
          src: i.image,
          alt: t(i.name, locale),
          title: t(i.name, locale),
          description: t(i.description, locale),
        }))}
        styles={{ container: { backgroundColor: "rgba(13,13,13,.96)" } }}
      />
    </section>
  );
}
