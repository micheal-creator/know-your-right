-- Know Your Right CMS — Supabase schema.
-- Run this in the SAME Supabase project you use for the company site
-- (it reuses the existing public.profiles + public.is_admin()).
-- SQL Editor → New query → paste → Run.

create table if not exists public.kyr_settings (
  id text primary key default 'global',
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

create table if not exists public.kyr_content (
  id uuid primary key default gen_random_uuid(),
  collection text not null,
  slug text not null,
  data jsonb not null default '{}',
  status text not null default 'published',
  sort_order integer not null default 0,
  updated_at timestamptz default now(),
  unique (collection, slug)
);

alter table public.kyr_settings enable row level security;
alter table public.kyr_content enable row level security;

-- Public can read; only admins can write.
drop policy if exists "kyr settings read" on public.kyr_settings;
create policy "kyr settings read" on public.kyr_settings for select using (true);
drop policy if exists "kyr settings admin" on public.kyr_settings;
create policy "kyr settings admin" on public.kyr_settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "kyr content read" on public.kyr_content;
create policy "kyr content read" on public.kyr_content for select using (true);
drop policy if exists "kyr content admin" on public.kyr_content;
create policy "kyr content admin" on public.kyr_content for all using (public.is_admin()) with check (public.is_admin());
