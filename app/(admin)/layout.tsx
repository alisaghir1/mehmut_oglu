import type { Metadata } from "next";
import { Suspense } from "react";
import { playfair, raleway } from "@/lib/fonts";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Mehmet Oglu", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${raleway.variable}`}>
      <body className="bg-ink-900">
        <Suspense fallback={<main className="flex min-h-svh items-center justify-center"><p role="status">Loading admin...</p></main>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
