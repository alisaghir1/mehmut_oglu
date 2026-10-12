"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/admin";
import { resources } from "@/lib/admin/resources";

const groups = [
  { label: "Site", keys: ["settings", "sections", "hero", "about"] },
  { label: "Content", keys: ["team", "categories", "menu", "services", "gallery", "news"] },
];

export function AdminSidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const item = (href: string, label: string, badge?: number) => (
    <Link
      key={href}
      href={href}
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
        active(href) ? "bg-oxblood/90 text-cream" : "text-sand hover:bg-ink-700 hover:text-cream"
      }`}
    >
      {label}
      {badge ? (
        <span className="rounded-full bg-parchment px-2 py-0.5 text-[10px] font-bold text-ink-900">{badge}</span>
      ) : null}
    </Link>
  );

  return (
    <aside className="flex h-svh w-64 shrink-0 flex-col border-r border-parchment/10 bg-ink-850">
      <Link href="/admin" className="flex items-center gap-3 px-5 py-5">
        <Image src="/brand/logo.svg" alt="" width={34} height={38} unoptimized />
        <span className="font-display text-[15px] font-extrabold uppercase tracking-[-0.02em] text-cream">
          Mehmet Oglu
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {item("/admin", "Dashboard")}
          {item("/admin/inbox", "Inbox", unread)}
        </div>
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.25em] !text-muted">{g.label}</p>
            <div className="space-y-1">
              {g.keys.map((k) => {
                const r = resources.find((x) => x.key === k)!;
                return item(`/admin/${r.key}`, r.label);
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-parchment/10 px-5 py-4">
        <p className="truncate text-[12px] !text-sand">{email}</p>
        <div className="mt-2 flex items-center justify-between">
          <a href="/en" target="_blank" rel="noreferrer" className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-cream">
            View site ↗
          </a>
          <form action={signOut}>
            <button type="submit" className="text-[11px] font-bold uppercase tracking-[0.15em] text-sand hover:text-oxblood-light">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
