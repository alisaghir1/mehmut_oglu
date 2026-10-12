"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: EASE } },
};

export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

type RevealProps = HTMLMotionProps<"div"> & {
  variants?: Variants;
  delay?: number;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
  once?: boolean;
};

/** Scroll-triggered reveal. Falls back to a static render for reduced-motion users. */
export function Reveal({
  variants = fadeUp,
  delay = 0,
  amount = 0.2,
  once = true,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={rest.className as string}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delay?: number;
  amount?: number;
};

/** Parent that staggers its `StaggerItem` children when scrolled into view. */
export function Stagger({ stagger = 0.12, delay = 0, amount = 0.15, children, ...rest }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={rest.className as string}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer(stagger, delay)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  variants = fadeUp,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { variants?: Variants }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={rest.className as string}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div variants={variants} {...rest}>
      {children}
    </motion.div>
  );
}
