"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      aria-label={t("switchLocale")}
      className={`font-display text-[11px] font-bold uppercase tracking-[0.2em] text-sand transition-colors hover:text-cream ${className}`}
    >
      <span className="text-cream">{locale}</span>
      <span className="mx-1.5 text-muted">/</span>
      <span>{next}</span>
    </button>
  );
}
