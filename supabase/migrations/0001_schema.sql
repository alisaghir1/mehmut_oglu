-- Mehmet Oglu — initial schema
-- Bilingual text is stored as JSONB { "en": "...", "tr": "..." }.
-- Public visitors: read published content, insert contact/reservation rows.
-- Admins (rows in public.admins): full CRUD on everything.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Validate a bilingual JSONB value: object with string "en" (tr optional).
create or replace function public.is_localized(v jsonb)
returns boolean
language sql
immutable
as $$
  select jsonb_typeof(v) = 'object'
     and jsonb_typeof(v->'en') = 'string'
     and (v->'tr' is null or jsonb_typeof(v->'tr') = 'string');
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id            smallint primary key default 1 check (id = 1),
  name          text not null,
  tagline       jsonb not null check (is_localized(tagline)),
  description   jsonb not null check (is_localized(description)),
  founded_year  int  not null,
  phone         text not null,
  email         text not null,
  address       jsonb not null check (is_localized(address)),
  hours         jsonb not null check (is_localized(hours)),
  map_embed_url text not null,
  social        jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

create table if not exists public.hero_slides (
  id         uuid primary key default gen_random_uuid(),
  sort_order int  not null default 0,
  eyebrow    jsonb not null check (is_localized(eyebrow)),
  title      jsonb not null check (is_localized(title)),
  image      text not null,
  image_alt  jsonb not null check (is_localized(image_alt)),
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.sections (
  key        text primary key,
  eyebrow    jsonb not null check (is_localized(eyebrow)),
  title      jsonb not null check (is_localized(title)),
  is_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.about (
  id            smallint primary key default 1 check (id = 1),
  paragraphs    jsonb not null default '[]'::jsonb,   -- Localized[]
  image_1       text not null,
  image_2       text not null,
  counter_value int  not null,
  counter_label jsonb not null check (is_localized(counter_label)),
  quote         jsonb not null check (is_localized(quote)),
  quote_author  text not null,
  updated_at    timestamptz not null default now()
);

create table if not exists public.team_members (
  id         uuid primary key default gen_random_uuid(),
  sort_order int  not null default 0,
  name       text not null,
  role       jsonb not null check (is_localized(role)),
  image      text not null,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  sort_order int  not null default 0,
  name       jsonb not null check (is_localized(name)),
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.menu_categories (id) on delete cascade,
  sort_order   int  not null default 0,
  name         jsonb not null check (is_localized(name)),
  description  jsonb not null check (is_localized(description)),
  price        numeric(10,2) not null check (price >= 0),
  currency     text not null default '€',
  image        text not null,
  is_available boolean not null default true,
  updated_at   timestamptz not null default now()
);
create index if not exists menu_items_category_idx on public.menu_items (category_id, sort_order);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  sort_order  int  not null default 0,
  title       jsonb not null check (is_localized(title)),
  description jsonb not null check (is_localized(description)),
  image       text not null,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         uuid primary key default gen_random_uuid(),
  sort_order int  not null default 0,
  image      text not null,
  caption    jsonb not null check (is_localized(caption)),
  width      int  not null default 1600,
  height     int  not null default 1200,
  is_active  boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  published_at date not null default current_date,
  is_published boolean not null default true,
  title        jsonb not null check (is_localized(title)),
  excerpt      jsonb not null check (is_localized(excerpt)),
  body         jsonb not null check (is_localized(body)),
  cover_image  text not null,
  gallery      jsonb not null default '[]'::jsonb,  -- string[]
  updated_at   timestamptz not null default now()
);
create index if not exists posts_published_idx on public.posts (is_published, published_at desc);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale     text not null default 'en',
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) between 3 and 200),
  message    text not null check (char_length(message) between 1 and 4000),
  is_read    boolean not null default false
);

create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  locale      text not null default 'en',
  name        text not null check (char_length(name) between 1 and 120),
  phone       text not null check (char_length(phone) between 7 and 30),
  email       text,
  date        date not null,
  "time"      time not null,
  guests      int  not null check (guests between 1 and 20),
  notes       text check (notes is null or char_length(notes) <= 1000),
  status      text not null default 'pending' check (status in ('pending','confirmed','declined','cancelled'))
);
create index if not exists reservations_date_idx on public.reservations (date, "time");

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array['site_settings','hero_slides','sections','about','team_members',
                           'menu_categories','menu_items','services','gallery_images','posts']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
                    for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admins           enable row level security;
alter table public.site_settings    enable row level security;
alter table public.hero_slides      enable row level security;
alter table public.sections         enable row level security;
alter table public.about            enable row level security;
alter table public.team_members     enable row level security;
alter table public.menu_categories  enable row level security;
alter table public.menu_items       enable row level security;
alter table public.services         enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.posts            enable row level security;
alter table public.contact_messages enable row level security;
alter table public.reservations     enable row level security;

-- admins: only admins may see who is an admin; managed via SQL/dashboard.
create policy "admins: self read"  on public.admins for select using (is_admin());

-- Public read of content tables (active/published rows), admin full access.
do $$
declare t text;
begin
  foreach t in array array['site_settings','sections','about']
  loop
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "admin all"   on public.%I for all using (is_admin()) with check (is_admin())', t);
  end loop;

  foreach t in array array['hero_slides','team_members','menu_categories','services','gallery_images']
  loop
    execute format('create policy "public read" on public.%I for select using (is_active or is_admin())', t);
    execute format('create policy "admin all"   on public.%I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

create policy "public read" on public.menu_items for select using (true);
create policy "admin all"   on public.menu_items for all using (is_admin()) with check (is_admin());

create policy "public read" on public.posts for select using (is_published or is_admin());
create policy "admin all"   on public.posts for all using (is_admin()) with check (is_admin());

-- Forms: anyone may insert; only admins may read/update/delete.
create policy "public insert" on public.contact_messages for insert with check (true);
create policy "admin all"     on public.contact_messages for all using (is_admin()) with check (is_admin());

create policy "public insert" on public.reservations for insert with check (true);
create policy "admin all"     on public.reservations for all using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------------
-- Storage: public bucket for site media, admin-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do nothing;

create policy "media public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media admin insert" on storage.objects for insert with check (bucket_id = 'media' and is_admin());
create policy "media admin update" on storage.objects for update using (bucket_id = 'media' and is_admin());
create policy "media admin delete" on storage.objects for delete using (bucket_id = 'media' and is_admin());
