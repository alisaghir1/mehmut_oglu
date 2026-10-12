"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { Stagger, StaggerItem, scaleIn } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Plus } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";
import { t, type GalleryImage, type SectionHeading as Heading } from "@/lib/content/types";

interface InteriorProps {
  heading: Heading;
  gallery: GalleryImage[];
}

/** Dinex #inside — PhotoSwipe grid replaced by a masonry-ish grid + lightbox. */
export function Interior({ heading, gallery }: InteriorProps) {
  const locale = useLocale() as Locale;
  const tg = useTranslations("gallery");
  const [index, setIndex] = useState(-1);

  return (
    <section id="interior" className="section-frame bg-ink-900">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />
        <div className="divider-l" />

        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6" stagger={0.08}>
          {gallery.map((g, i) => {
            const portrait = g.height > g.width;
            return (
              <StaggerItem
                key={g.id}
                variants={scaleIn}
                className={portrait ? "row-span-2" : i === 0 ? "col-span-2 md:col-span-1" : ""}
              >
                <motion.button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={tg("open", { index: i + 1 })}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className={`group relative block h-full w-full overflow-hidden rounded-card bg-ink-700 ${
                    portrait ? "aspect-[2/3]" : "aspect-[4/3]"
                  }`}
                >
                  <motion.div
                    variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={g.image}
                      alt={t(g.caption, locale)}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                  {/* Dinex .hover-effect — inset dark veil with + icon */}
                  <motion.div
                    variants={{ rest: { opacity: 0 }, hover: { opacity: 0.85 } }}
                    transition={{ duration: 0.8 }}
                    className="pointer-events-none absolute inset-6 flex items-center justify-center rounded-card bg-ink-950 md:inset-10"
                    aria-hidden
                  >
                    <motion.span
                      variants={{ rest: { scale: 0.6, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="text-parchment"
                    >
                      <Plus size={28} />
                    </motion.span>
                  </motion.div>
                  <span className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-ink-950/70 px-4 py-2 font-sans text-[11px] font-semibold text-cream opacity-0 backdrop-blur transition-opacity duration-700 group-hover:opacity-100 md:bottom-6 md:left-6">
                    {t(g.caption, locale)}
                  </span>
                </motion.button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
      <div className="divider-xl" />

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        plugins={[Captions, Zoom]}
        slides={gallery.map((g) => ({
          src: g.image,
          width: g.width,
          height: g.height,
          alt: t(g.caption, locale),
          title: t(g.caption, locale),
        }))}
        styles={{ container: { backgroundColor: "rgba(13,13,13,.96)" } }}
      />
    </section>
  );
}
