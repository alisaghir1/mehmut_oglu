import { Reveal } from "@/components/motion/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Heading level; sections use h2, hero/post pages use h1. */
  as?: "h1" | "h2";
  align?: "center" | "left";
  id?: string;
  className?: string;
}

/**
 * Dinex section header: eyebrow with 15px hairlines, 50px divider,
 * then the 55px Playfair display title. The last word is tinted parchment
 * (mirrors `The <span>Restaurant</span>` in the template).
 */
export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  align = "center",
  id,
  className = "",
}: SectionHeadingProps) {
  const words = title.trim().split(" ");
  const last = words.pop();
  const lead = words.join(" ");

  return (
    <Reveal className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <p
        className={`font-display text-label font-semibold uppercase tracking-[-0.02em] text-sand ${
          align === "center" ? "" : "-ml-[30px]"
        }`}
      >
        <span className="eyebrow-lines">{eyebrow}</span>
      </p>
      <div className="divider-m" />
      <Tag id={id} className="text-display font-bold text-balance text-cream">
        {lead && <>{lead} </>}
        <span className="text-parchment">{last}</span>
      </Tag>
    </Reveal>
  );
}
