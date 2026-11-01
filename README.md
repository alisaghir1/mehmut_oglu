# Mehmet Oglu — Döner & İskender

Bilingual (EN/TR) restaurant website with a Supabase-backed admin panel.
Design language: the **Dinex dark** template geometry, re-skinned with the
Mehmet Oglu brand palette (charcoal, parchment, blood red, antique brass).

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Cache Components, Server Actions) |
| Styling | Tailwind CSS v4 — tokens in `app/globals.css` |
| Motion | Framer Motion (hero slider, scroll reveals, tabs, drawer) |
| i18n | next-intl — `/en`, `/tr` via `proxy.ts` |
| Data | Supabase (Postgres + RLS, Auth, Storage) with `@supabase/ssr` |
| Images | `next/image` (AVIF/WebP), `yet-another-react-lightbox` |

Next.js and its ESLint configuration are pinned to 16.4.3. Upgrade reminders
use the security policy to recommend patched stable releases.

## Getting started

```bash
npm install
cp .env.example .env.local      # fill in Supabase URL + publishable key
npm run dev
```

Without Supabase configured the public site still renders from the bundled
demo seed (`lib/content/seed.ts`) and form submissions are logged to the console.

### Supabase setup (one time)

1. Create a project at supabase.com and copy **Project URL** (Project Settings
   → API) and **publishable key** (Project Settings → API Keys) into `.env.local`
   as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a fallback.
   No secret/service-role key or database password is needed by this app;
   never put those in `NEXT_PUBLIC_*` variables.
2. In the SQL editor run, in order:
   - `supabase/migrations/0001_schema.sql` — tables, RLS, storage bucket
   - `supabase/migrations/0002_seed.sql` — demo content
3. Create your admin user under **Authentication → Users** (email + password),
   then grant admin rights:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```
4. Restart `npm run dev` and sign in at `/admin/login`.

Set `NEXT_PUBLIC_SITE_URL` to the production domain for correct canonical,
OpenGraph and sitemap URLs.

## Project layout

```
app/
  (site)/[locale]/        public site (home, /news, /news/[slug], 404, OG image)
  (admin)/admin/          login + authenticated admin shell (dashboard, CRUD, inbox)
  actions/                Server Actions (public forms, admin CRUD/auth/upload)
components/
  sections/               Hero, About, Team, Menu, Services, Interior, News, Contact
  layout/                 Header (drawer, locale switch), Footer, BackToTop
  forms/                  Contact + reservation forms (useActionState)
  motion/                 Reveal/Stagger, CountUp, ParallaxImage
  admin/                  Sidebar, RecordForm, ImageField, LoginForm
lib/
  content/                types, seed, Supabase loader, cached `getSiteContent()`
  admin/resources.ts      declarative CRUD definitions for every table
  supabase/               server/browser clients, proxy session refresh, auth guards
  forms/                  zod schemas + persistence
i18n/, messages/          routing config and EN/TR UI strings
supabase/migrations/      schema + seed SQL
public/brand, images/     logo (SVG/PNG), optimised brand renders, placeholders
_source/ (git-ignored)    original template + brand files for reference
```

## Content model

Bilingual text is stored as JSONB `{ "en": "…", "tr": "…" }`. Every content
table is editable in `/admin`; saving calls `updateTag("site-content")` so the
statically cached site updates immediately. Public forms insert into
`contact_messages` / `reservations` (insert-only RLS); admins triage them in
**Inbox**.

To change what the admin can edit, update `lib/admin/resources.ts` — list
columns, fields, validation and the form UI derive from it.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build (type-checks)
npm run lint     # eslint
npm test         # public/admin validation and Supabase environment regression tests
npx tsx scripts/generate-seed-sql.ts   # regenerate 0002_seed.sql from seed.ts
```

Public form dates are validated as real calendar dates and times as 24-hour
`HH:mm` values. The mobile public navigation traps keyboard focus while open;
the admin navigation collapses on smaller screens and tables scroll horizontally.
Admin image URLs must be local paths or public URLs from this project's Supabase
Storage, matching the image optimizer's configured host.
