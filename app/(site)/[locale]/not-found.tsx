import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-[clamp(5rem,14vw,10rem)] font-bold leading-none tracking-[-0.04em] text-ink-600">
        404
      </p>
      <div className="divider-s" />
      <h1 className="text-display font-bold text-cream">{t("title")}</h1>
      <div className="divider-s" />
      <p className="max-w-md">{t("body")}</p>
      <div className="divider-m" />
      <Button as={Link} href="/" variant="outline">
        {t("home")}
      </Button>
    </section>
  );
}
