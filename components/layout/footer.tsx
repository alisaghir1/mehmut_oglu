import Image from "next/image";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Twitter } from "@/components/ui/icons";
import { CurrentYear } from "@/components/ui/current-year";
import type { SiteSettings } from "@/lib/content/types";
import { BackToTop } from "./back-to-top";

export function Footer({ settings }: { settings: SiteSettings }) {
  const t = useTranslations("footer");
  const socials = [
    { key: "instagram", href: settings.social.instagram, Icon: Instagram },
    { key: "facebook", href: settings.social.facebook, Icon: Facebook },
    { key: "twitter", href: settings.social.twitter, Icon: Twitter },
  ].filter((s) => s.href);

  return (
    <footer className="section-frame bg-ink-900">
      <div className="divider-l" />
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 text-center">
        <Image
          src="/brand/logo.svg"
          alt="Mehmet Oglu — Döner & İskender — A century of flavours"
          width={126}
          height={140}
          unoptimized
          className="opacity-95"
        />
        <div className="divider-m" />
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-sand">
          {t("builtWith", { year: settings.foundedYear })}
        </p>
        <div className="divider-s" />
        <ul className="flex items-center gap-7" aria-label="Social media">
          {socials.map(({ key, href, Icon }) => (
            <li key={key}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={key}
                className="text-sand hover:text-cream"
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>
        <div className="divider-m" />
        <div className="hairline w-full max-w-md" />
        <div className="divider-s" />
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-stone">
          {t.rich("rights", { year: () => <CurrentYear fallback={settings.foundedYear} />, name: settings.name })}
        </p>
      </div>
      <div className="divider-l" />
      <BackToTop label={t("backToTop")} />
    </footer>
  );
}
