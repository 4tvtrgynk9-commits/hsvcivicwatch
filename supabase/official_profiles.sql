create table if not exists public.official_profiles (
  id uuid primary key default gen_random_uuid(),
  module text not null default 'officials_elections',
  slug text unique,
  name text not null,
  office text,
  geography text,
  party text,
  kind text default 'official',
  featured boolean not null default false,
  sort_order integer not null default 0,
  scope text,
  scopes text[] default array['overview']::text[],
  role_label text,
  status_line text,
  headshot_url text,
  metrics jsonb not null default '[]'::jsonb,
  quick_facts jsonb not null default '[]'::jsonb,
  profile jsonb not null default '{}'::jsonb,
  on_record jsonb not null default '[]'::jsonb,
  donors jsonb not null default '{}'::jsonb,
  votes jsonb not null default '[]'::jsonb,
  contact jsonb not null default '{}'::jsonb,
  decoder jsonb not null default '{}'::jsonb,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists official_profiles_module_idx on public.official_profiles (module);
create index if not exists official_profiles_sort_idx on public.official_profiles (featured desc, sort_order asc, name asc);

alter table public.official_profiles enable row level security;

drop policy if exists "official_profiles_public_read" on public.official_profiles;
create policy "official_profiles_public_read"
on public.official_profiles
for select
to anon, authenticated
using (true);
