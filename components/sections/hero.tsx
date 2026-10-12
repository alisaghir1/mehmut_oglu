"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from "@/components/ui/icons";
import type { Locale } from "@/i18n/routing";
import { t as tr, type HeroSlide } from "@/lib/content/types";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const INTERVAL = 6500;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("hero");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (!playing || slides.length < 2) return;
    timer.current = setTimeout(() => go(1), INTERVAL);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, playing, go, slides.length]);

  const slide = slides[index];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      id="home"
      aria-roledescription="carousel"
      aria-label="Hero"
      className="relative h-[100svh] min-h-[586px] w-full overflow-hidden bg-ink-950"
    >
      {/* Backgrounds */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: reduce ? 1 : 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduce ? 0 : INTERVAL / 1000 + 1.5, ease: "linear" }}
          >
            <Image
              src={slide.image}
              alt={tr(slide.imageAlt, locale)}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              className="object-cover"
            />
          </motion.div>
          {/* Dinex overlay: dark gradient so parchment type stays legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/35 to-ink-950/85" />
          <div className="absolute inset-0 bg-ink-950/20" />
        </motion.div>
      </AnimatePresence>

      {/* Copy */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
              exit: { transition: { staggerChildren: 0.06, staggerDirection: -1 } },
            }}
            className="max-w-5xl"
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
                exit: { opacity: 0, y: -10, transition: { duration: 0.4 } },
              }}
              className="font-display text-eyebrow font-bold uppercase text-parchment"
            >
              <span className="eyebrow-rule">{tr(slide.eyebrow, locale)}</span>
              <span className="text-sand">{pad(index + 1)}</span>
            </motion.p>
            <div className="h-7" />
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
                exit: { opacity: 0, y: -16, transition: { duration: 0.4 } },
              }}
              className="text-display font-bold text-balance text-cream drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)]"
            >
              {tr(slide.title, locale)}
            </motion.h1>
            <div className="h-10" />
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 1 } },
                exit: { opacity: 0, transition: { duration: 0.3 } },
              }}
              className="the-line !bg-parchment/50"
              aria-hidden
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scroll hint (left) */}
      <a
        href="#about"
        className="absolute bottom-10 left-6 z-10 hidden items-center gap-3 font-display text-[10px] font-bold uppercase tracking-[0.3em] text-sand hover:text-cream lg:flex lg:left-11"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-flex"
        >
          <ArrowDown size={14} />
        </motion.span>
        {t("scroll")}
      </a>

      {/* Controls (right) — Dinex hero-slider-bg-controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 right-5 z-10 flex items-center gap-2 lg:bottom-[50px] lg:right-11">
          <span className="mr-3 font-display text-[11px] font-bold tracking-[0.2em] text-sand" aria-live="polite">
            <span className="sr-only">{t("slide", { current: index + 1, total: slides.length })}</span>
            <span aria-hidden>
              {pad(index + 1)} <span className="text-muted">/</span> {pad(slides.length)}
            </span>
          </span>
          <Control onClick={() => setPlaying((p) => !p)} label={playing ? t("pause") : t("play")}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </Control>
          <Control onClick={() => go(-1)} label={t("prev")}>
            <ArrowLeft size={16} />
          </Control>
          <Control onClick={() => go(1)} label={t("next")}>
            <ArrowRight size={16} />
          </Control>
        </div>
      )}

      {/* Dinex framed look: the hero bleeds, the next section is inset by 40px */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-850 to-transparent" />
    </section>
  );
}

function Control({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileHover={{ scale: 1.08, backgroundColor: "rgba(136,8,7,1)", borderColor: "rgba(136,8,7,1)" }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-parchment/30 text-cream backdrop-blur-sm"
    >
      {children}
    </motion.button>
  );
}
