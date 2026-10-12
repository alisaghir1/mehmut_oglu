import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { playfair, raleway } from "@/lib/fonts";
import { getSiteContent } from "@/lib/content";
import { SITE_URL, languageAlternates } from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s — Mehmet Oglu`,
    },
    description: t("description"),
    applicationName: "Mehmet Oglu",
    keywords: ["döner", "iskender", "turkish restaurant", "istanbul", "kebap", "mehmet oglu"],
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      siteName: "Mehmet Oglu",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      alternateLocale: locale === "tr" ? ["en_US"] : ["tr_TR"],
      url: `${SITE_URL}/${locale}`,
      title: t("title"),
      description: t("description"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: [{ url: "/brand/logo-192.png", type: "image/png", sizes: "192x192" }],
      apple: [{ url: "/brand/logo-512.png", sizes: "512x512" }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale as Locale);
  const { settings } = await getSiteContent();

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${raleway.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer settings={settings} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
