-- FolioFast schema. Run once in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_-]{3,20}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  template text not null default 'minimal-clean',
  is_published boolean not null default false,
  wizard_step integer not null default 1,
  wizard_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;

-- Public portfolio pages resolve a username to a user id before reading the
-- portfolio, so profiles must stay readable anonymously.
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Published portfolios are publicly readable"
  on public.portfolios for select
  using (is_published or auth.uid() = user_id);

create policy "Users insert their own portfolio"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

create policy "Users update their own portfolio"
  on public.portfolios for update
  using (auth.uid() = user_id);

create policy "Users delete their own portfolio"
  on public.portfolios for delete
  using (auth.uid() = user_id);
