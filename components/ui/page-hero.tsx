import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  image: string;
  meta?: React.ReactNode;
}

/** Compact hero for inner pages (Dinex blog-0X header). */
export function PageHero({ eyebrow, title, image, meta }: PageHeroProps) {
  return (
    <section className="relative h-[70svh] min-h-[480px] w-full overflow-hidden bg-ink-950">
      <Image src={image} alt="" fill priority sizes="100vw" quality={85} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/45 to-ink-850" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20 text-center">
        <Reveal>
          <p className="font-display text-eyebrow font-bold uppercase text-parchment">
            <span className="eyebrow-rule">{eyebrow}</span>
          </p>
          <div className="h-7" />
          <h1 className="mx-auto max-w-4xl text-display font-bold text-balance text-cream">{title}</h1>
          {meta && <div className="mt-8">{meta}</div>}
        </Reveal>
      </div>
    </section>
  );
}
