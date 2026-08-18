-- Know Your Right — Supabase schema
-- =====================================================================
-- Run this in the Supabase SQL Editor (New query → paste → Run).
-- The app runs in DEMO mode (browser-local) until you set
-- VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY; then it uses this backend.
--
-- Design:
--   profiles         one row per auth user; `is_admin` gates the console
--   content_entries  legal reference entries (public read, admin write)
--   lawyers          directory (public reads APPROVED only, admin writes)
--   cases            Hire-a-Lawyer requests (anyone submits, admin manages)
--   conversations    support chats (owner = the user; admins see all)
--   messages         chat messages (realtime)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------- profiles + admin helper ----------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

-- Auto-create a profile when a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Is the current user an admin? (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ---------- content_entries ------------------------------------------
create table if not exists public.content_entries (
  id text primary key,
  type text not null,
  category text not null,
  title text not null,
  reference text,
  summary text not null,
  original text,
  tags jsonb not null default '[]',
  last_verified date,
  source text,
  fine integer,
  points integer,
  code text,
  severity text,
  updated_at timestamptz not null default now()
);

alter table public.content_entries enable row level security;

create policy "content: public read" on public.content_entries
  for select using (true);
create policy "content: admin write" on public.content_entries
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- lawyers --------------------------------------------------
create table if not exists public.lawyers (
  id text primary key,
  name text not null,
  firm text,
  city text,
  states jsonb not null default '[]',
  categories jsonb not null default '[]',
  status text not null default 'pending',   -- pending | approved | suspended
  verified boolean not null default false,
  bar_number text,
  rating numeric default 0,
  reviews integer default 0,
  fee_range text,
  responds_within text,
  phone text,
  whatsapp text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lawyers enable row level security;

create policy "lawyers: public read approved" on public.lawyers
  for select using (status = 'approved' or public.is_admin());
create policy "lawyers: admin write" on public.lawyers
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- cases (Hire-a-Lawyer requests) ---------------------------
create table if not exists public.cases (
  id text primary key,
  issue text,
  state text,
  description text,
  name text,
  contact text,
  status text not null default 'new',        -- new | reviewing | matched | closed
  note text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cases enable row level security;

-- Anyone (including anonymous) can submit a request; only admins can read/manage.
create policy "cases: anyone insert" on public.cases
  for insert with check (true);
create policy "cases: admin read" on public.cases
  for select using (public.is_admin());
create policy "cases: admin update" on public.cases
  for update using (public.is_admin()) with check (public.is_admin());
create policy "cases: admin delete" on public.cases
  for delete using (public.is_admin());

-- ---------- support conversations + messages -------------------------
-- Users are identified by Supabase auth (enable "Anonymous sign-ins" in
-- Auth settings so guests get a uid without creating an account).
create table if not exists public.conversations (
  id text primary key,
  subject text,
  name text,
  user_id uuid default auth.uid(),
  status text not null default 'open',       -- open | closed
  last_sender text default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id text primary key,
  conversation_id text not null references public.conversations(id) on delete cascade,
  sender text not null,                       -- user | admin
  body text not null,
  seq bigint,
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "conv: owner or admin read" on public.conversations
  for select using (user_id = auth.uid() or public.is_admin());
create policy "conv: owner insert" on public.conversations
  for insert with check (user_id = auth.uid());
create policy "conv: owner or admin update" on public.conversations
  for update using (user_id = auth.uid() or public.is_admin());

create policy "msg: participants read" on public.messages
  for select using (
    public.is_admin() or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );
create policy "msg: participants insert" on public.messages
  for insert with check (
    public.is_admin() or exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.user_id = auth.uid()
    )
  );

-- Realtime for live chat.
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;

-- ---------- make yourself an admin -----------------------------------
-- After signing up once in the app:
--   update public.profiles set is_admin = true where email = 'you@example.com';
