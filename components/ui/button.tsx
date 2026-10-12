import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "solid" | "outline" | "ghost";
type Size = "md" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-3 font-display text-eyebrow font-bold uppercase tracking-[0.12em] transition-all duration-500 ease-out disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  solid:
    "bg-oxblood text-cream shadow-accent hover:bg-oxblood-light hover:shadow-[0_14px_44px_-10px_rgb(165_19_18/0.6)]",
  outline:
    "border border-sand/60 text-parchment hover:border-oxblood-light hover:bg-oxblood hover:text-cream",
  ghost: "text-sand hover:text-cream",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-8",
  sm: "h-10 px-5 text-[11px]",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "outline",
  size = "md",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag
      className={`${base} ${variants[variant]} ${variant === "ghost" ? "" : sizes[size]} ${className}`}
      {...props}
    />
  );
}
