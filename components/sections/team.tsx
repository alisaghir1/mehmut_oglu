"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { t, type SectionHeading as Heading, type TeamMember } from "@/lib/content/types";

interface TeamProps {
  heading: Heading;
  team: TeamMember[];
  locale: Locale;
}

export function Team({ heading, team, locale }: TeamProps) {
  return (
    <section id="team" className="section-frame bg-ink-850">
      <div className="divider-xl" />
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionHeading eyebrow={t(heading.eyebrow, locale)} title={t(heading.title, locale)} />
        <div className="divider-l" />

        <Stagger className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8" stagger={0.1}>
          {team.map((m) => (
            <StaggerItem key={m.id}>
              <motion.figure
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="group relative aspect-[3/4] overflow-hidden rounded-card bg-ink-700"
              >
                <motion.div
                  variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
                  transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
                {/* Dinex .hover-effect.the-team — inset circular veil */}
                <motion.div
                  variants={{ rest: { opacity: 0, scale: 0.9 }, hover: { opacity: 0.85, scale: 1 } }}
                  transition={{ duration: 0.8 }}
                  className="pointer-events-none absolute inset-[25px] rounded-full bg-ink-950"
                  aria-hidden
                />
                {/* Dinex .team-box — bottom-left label with 0 20 0 20 radius */}
                <figcaption className="absolute bottom-0 left-0 z-10 rounded-tr-card bg-ink-900 px-5 py-4 text-left">
                  <span className="block font-display text-label font-extrabold uppercase text-parchment">
                    {m.name}
                  </span>
                  <span className="mt-0.5 block font-display text-[13px] font-medium uppercase tracking-[0.02em] text-sand">
                    {t(m.role, locale)}
                  </span>
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <div className="divider-xl" />
    </section>
  );
}
