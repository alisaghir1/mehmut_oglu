import type { Metadata } from "next";
import { playfair, raleway } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Mehmet Oglu", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-ink-900">{children}</body>
    </html>
  );
}
