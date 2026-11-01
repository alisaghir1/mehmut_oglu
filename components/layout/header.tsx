"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Close, Menu as MenuIcon } from "@/components/ui/icons";
import { LocaleSwitcher } from "./locale-switcher";

const SECTIONS = ["home", "about", "menu", "services", "news", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  // Dinex `navbar-bg-switch`: transparent over the hero, solid once scrolled (or on inner pages).
  const scrolled = !isHome || pastHero;

  // Close the drawer when the route changes (state adjusted during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav item whose section is currently in view.
  useEffect(() => {
    if (!isHome) return;
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  // Lock scroll while the drawer is open and close it on route change.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const trigger = menuButtonRef.current;
    const focusable = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const href = (id: SectionId) => (id === "home" ? "/" : `/#${id}`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1001] focus:bg-oxblood focus:px-4 focus:py-2 focus:text-cream"
      >
        {t("skipToContent")}
      </a>

      <motion.header
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(17,17,17,0.92)" : "rgba(17,17,17,0)",
          paddingTop: scrolled ? 12 : 28,
          paddingBottom: scrolled ? 12 : 28,
        }}
        transition={{ duration: 0.4, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-[999] px-5 backdrop-blur-md lg:px-10 ${
          scrolled ? "border-b border-parchment/10" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between" aria-label="Primary">
          <Link href="/" aria-label="Mehmet Oglu — home" className="shrink-0">
            <Logo size={scrolled ? 40 : 48} priority />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {SECTIONS.map((id) => {
              const isActive = isHome && active === id;
              return (
                <li key={id}>
                  <Link
                    href={href(id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative font-display text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors hover:text-cream ${
                      isActive ? "text-cream" : "text-sand"
                    }`}
                  >
                    {t(id)}
                    <span
                      className={`absolute -bottom-2 left-1/2 h-px -translate-x-1/2 bg-oxblood-light transition-all duration-500 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-7 lg:flex">
            <LocaleSwitcher />
            <Button as={Link} href="/#reservation" variant="outline" size="sm">
              {t("reserve")}
            </Button>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            className="text-cream lg:hidden"
          >
            <MenuIcon size={26} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("openMenu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="fixed inset-0 z-[1000] flex flex-col bg-ink-900/97 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <Logo size={40} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("closeMenu")}
                className="text-cream"
              >
                <Close size={28} />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              className="flex flex-1 flex-col items-center justify-center gap-7"
            >
              {SECTIONS.map((id) => (
                <motion.li
                  key={id}
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
                  }}
                >
                  <Link
                    href={href(id)}
                    onClick={() => setOpen(false)}
                    className={`font-display text-3xl font-bold tracking-[-0.03em] ${
                      isHome && active === id ? "text-parchment" : "text-cream/80"
                    }`}
                  >
                    {t(id)}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <div className="flex items-center justify-between gap-6 px-6 pb-10">
              <LocaleSwitcher />
              <Button as={Link} href="/#reservation" variant="solid" onClick={() => setOpen(false)}>
                {t("reserve")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
