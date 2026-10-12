import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";

interface ParallaxBandProps {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
}

/** Dinex #blank — full-bleed parallax image band between sections. */
export function ParallaxBand({ image, alt, eyebrow, title }: ParallaxBandProps) {
  return (
    <section aria-label={title} className="relative h-[60vh] min-h-[420px] overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <ParallaxImage src={image} alt={alt} sizes="100vw" range={120} className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-ink-950/60" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-850 via-transparent to-ink-900" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="font-display text-eyebrow font-bold uppercase text-parchment">
            <span className="eyebrow-rule">{eyebrow}</span>
          </p>
          <div className="divider-s" />
          <p className="font-display text-quote font-bold text-balance !text-cream">{title}</p>
        </Reveal>
      </div>
    </section>
  );
}
