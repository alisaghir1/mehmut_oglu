import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/forms/contact-form";
import { ReservationForm } from "@/components/forms/reservation-form";
import { Reveal, Stagger, StaggerItem, fade } from "@/components/motion/reveal";
import { Clock, Mail, Phone, Pin } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/i18n/routing";
import { t, type SectionHeading as Heading, type SiteSettings } from "@/lib/content/types";

interface ContactProps {
  headings: { contact: Heading; reservation: Heading; location: Heading };
  settings: SiteSettings;
  locale: Locale;
}

export async function Contact({ headings, settings, locale }: ContactProps) {
  const tc = await getTranslations({ locale, namespace: "contact" });
  const info = [
    { Icon: Phone, label: tc("phone"), value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { Icon: Mail, label: tc("emailLabel"), value: settings.email, href: `mailto:${settings.email}` },
    { Icon: Pin, label: tc("address"), value: t(settings.address, locale) },
    { Icon: Clock, label: tc("hours"), value: t(settings.hours, locale) },
  ];

  return (
    <>
      {/* Reservation — Dinex .reservation-wrapper */}
      <section id="reservation" className="section-frame bg-ink-900 scroll-mt-20">
        <div className="divider-xl" />
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading eyebrow={t(headings.reservation.eyebrow, locale)} title={t(headings.reservation.title, locale)} />
          <div className="divider-l" />
          <Reveal>
            <ReservationForm />
          </Reveal>
        </div>
        <div className="divider-xl" />
      </section>

      {/* Contact — Dinex #contact */}
      <section id="contact" className="section-frame bg-ink-850 scroll-mt-20">
        <div className="divider-xl" />
        <div className="mx-auto max-w-[1200px] px-6">
          <SectionHeading eyebrow={t(headings.contact.eyebrow, locale)} title={t(headings.contact.title, locale)} />
          <div className="divider-l" />

          {/* Dinex .contact-info-description — icon, uppercase label, value */}
          <Stagger className="grid grid-cols-2 gap-10 md:grid-cols-4" stagger={0.1}>
            {info.map(({ Icon, label, value, href }) => (
              <StaggerItem key={label} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-parchment/15 text-parchment">
                  <Icon size={22} />
                </span>
                <p className="mt-5 font-display text-[11px] font-bold uppercase tracking-[0.25em] !text-sand">{label}</p>
                {href ? (
                  <a href={href} className="mt-2 block text-[13px] font-semibold tracking-[0.05em] text-cream hover:text-parchment">
                    {value}
                  </a>
                ) : (
                  <p className="mt-2 text-[13px] font-semibold !text-cream">{value}</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>

          <div className="divider-l" />
          <Reveal variants={fade}>
            <div className="the-line" aria-hidden />
          </Reveal>
          <div className="divider-l" />

          <Reveal className="text-center">
            <h3 className="font-display text-3xl font-bold tracking-[-0.03em] text-cream">{tc("writeTitle")}</h3>
          </Reveal>
          <div className="divider-m" />
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
        <div className="divider-xl" />
      </section>

      {/* Location — Dinex map section, framed with asymmetric radius */}
      <section id="location" className="section-frame bg-ink-900">
        <div className="divider-xl" />
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <SectionHeading eyebrow={t(headings.location.eyebrow, locale)} title={t(headings.location.title, locale)} />
          <div className="divider-l" />
          <Reveal variants={fade}>
            <div className="relative aspect-[16/9] overflow-hidden rounded-tr-feature rounded-bl-feature bg-ink-700 md:aspect-[21/9]">
              <iframe
                title={t(headings.location.title, locale)}
                src={settings.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.05] invert-[0.92] hue-rotate-180 saturate-[0.4]"
              />
            </div>
          </Reveal>
        </div>
        <div className="divider-xl" />
      </section>
    </>
  );
}
