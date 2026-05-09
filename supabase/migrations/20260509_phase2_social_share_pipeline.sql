create extension if not exists pgcrypto;
create table if not exists public.social_card_queue (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('hsv','veritas')),
  category text not null,
  source_record_type text,
  source_record_id text,
  source_ref text,
  status text not null default 'queued',
  scheduled_for timestamptz,
  generated_at timestamptz not null default now(),
  posted_at timestamptz,
  platform text,
  visual_style jsonb not null default '{}'::jsonb,
  slide_payload jsonb not null default '{}'::jsonb,
  media_payload jsonb not null default '{}'::jsonb,
  platform_captions jsonb not null default '{}'::jsonb,
  hashtags jsonb not null default '{}'::jsonb,
  share_payload jsonb not null default '{}'::jsonb,
  admin_notes text,
  selected_variant text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.social_hashtag_sets (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('hsv','veritas')),
  scope text not null,
  platform text not null default 'instagram',
  content_type text,
  linked_record_id text,
  brand_tags text[] not null default '{}'::text[],
  topic_tags text[] not null default '{}'::text[],
  local_or_national_tags text[] not null default '{}'::text[],
  trending_tags text[] not null default '{}'::text[],
  avoid_tags text[] not null default '{}'::text[],
  recommended_final_set text[] not null default '{}'::text[],
  reasoning_summary text,
  raw_result jsonb not null default '{}'::jsonb,
  approved_by_admin boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.content_poll_records (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('hsv','veritas')),
  poll_type text not null,
  linked_record_type text,
  linked_record_id text,
  question text not null,
  option_a text,
  option_b text,
  correct_answer text,
  reveal_text text,
  cta_text text,
  cta_link text,
  story_slide_payload jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_social_card_queue_workspace_status on public.social_card_queue(workspace,status,scheduled_for,created_at desc);
create index if not exists idx_social_card_queue_category on public.social_card_queue(workspace,category,created_at desc);
create index if not exists idx_social_hashtag_sets_workspace on public.social_hashtag_sets(workspace,scope,platform,expires_at desc);
create index if not exists idx_content_poll_records_workspace on public.content_poll_records(workspace,poll_type,status,created_at desc);
