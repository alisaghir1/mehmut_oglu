import Image from "next/image";

interface LogoProps {
  /** Emblem height in px. */
  size?: number;
  withWordmark?: boolean;
  className?: string;
  priority?: boolean;
}

export function Logo({ size = 48, withWordmark = true, className = "", priority }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/brand/logo.svg"
        alt="Mehmet Oglu emblem"
        width={Math.round(size * (755.7 / 841.2))}
        height={size}
        priority={priority}
        unoptimized
      />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[17px] font-extrabold uppercase tracking-[-0.02em] text-cream">
            Mehmet Oglu
          </span>
          <span className="mt-1 font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-sand">
            Döner &amp; İskender
          </span>
        </span>
      )}
    </span>
  );
}
