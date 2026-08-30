-- FolioFast schema. Idempotent — safe to re-run in the Supabase SQL editor.

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
drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

drop policy if exists "Users insert their own profile" on public.profiles;
create policy "Users insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Published portfolios are publicly readable" on public.portfolios;
create policy "Published portfolios are publicly readable"
  on public.portfolios for select
  using (is_published or auth.uid() = user_id);

drop policy if exists "Users insert their own portfolio" on public.portfolios;
create policy "Users insert their own portfolio"
  on public.portfolios for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update their own portfolio" on public.portfolios;
create policy "Users update their own portfolio"
  on public.portfolios for update
  using (auth.uid() = user_id);

drop policy if exists "Users delete their own portfolio" on public.portfolios;
create policy "Users delete their own portfolio"
  on public.portfolios for delete
  using (auth.uid() = user_id);

-- One row per resume-import attempt, used to rate-limit the endpoint per user.
-- /api/resume-import calls a paid model, so it needs a durable counter rather
-- than in-memory state that resets on every serverless cold start.
create table if not exists public.resume_imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists resume_imports_user_created_at
  on public.resume_imports (user_id, created_at desc);

alter table public.resume_imports enable row level security;

drop policy if exists "Users read their own import log" on public.resume_imports;
create policy "Users read their own import log"
  on public.resume_imports for select
  using (auth.uid() = user_id);

drop policy if exists "Users insert their own import log" on public.resume_imports;
create policy "Users insert their own import log"
  on public.resume_imports for insert
  with check (auth.uid() = user_id);

-- updated_at only defaults on insert, so without this trigger every row reports
-- its creation time forever and "last edited" is wrong wherever it is shown.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at
  before update on public.portfolios
  for each row execute function public.set_updated_at();

-- Storage. The app uploads profile photos, project covers and company logos to
-- this bucket and reads them back with getPublicUrl, so it must be public-read.
-- Uploads are keyed by `<user-id>/...`, which is what the write policies check.
insert into storage.buckets (id, name, public)
  values ('portfolio-assets', 'portfolio-assets', true)
  on conflict (id) do update set public = true;

drop policy if exists "Portfolio assets are publicly readable" on storage.objects;
create policy "Portfolio assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'portfolio-assets');

drop policy if exists "Users upload their own assets" on storage.objects;
create policy "Users upload their own assets"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users update their own assets" on storage.objects;
create policy "Users update their own assets"
  on storage.objects for update
  using (
    bucket_id = 'portfolio-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users delete their own assets" on storage.objects;
create policy "Users delete their own assets"
  on storage.objects for delete
  using (
    bucket_id = 'portfolio-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
