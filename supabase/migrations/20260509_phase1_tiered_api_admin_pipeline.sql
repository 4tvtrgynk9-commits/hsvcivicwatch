create extension if not exists pgcrypto;

create table if not exists public.admin_draft_records (
  id uuid primary key default gen_random_uuid(),
  workspace text not null check (workspace in ('hsv', 'veritas')),
  draft_type text not null,
  status text not null default 'parsed',
  title text,
  raw_text text,
  parsed_payload jsonb not null default '{}'::jsonb,
  public_payload jsonb not null default '{}'::jsonb,
  validation_result jsonb not null default '{}'::jsonb,
  score_bundle jsonb not null default '{}'::jsonb,
  readiness_score_50 int,
  primary_score_50 int,
  public_score_10 numeric,
  needs_review boolean not null default false,
  admin_notes text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_source_records (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.admin_draft_records(id) on delete cascade,
  workspace text not null check (workspace in ('hsv', 'veritas')),
  source_id text not null,
  title text,
  url text,
  publisher text,
  date text,
  source_type text,
  status text not null default 'active',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_claim_records (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.admin_draft_records(id) on delete cascade,
  workspace text not null check (workspace in ('hsv', 'veritas')),
  claim_id text not null,
  claim_text text not null,
  claim_type text not null default 'general',
  source_ids text[] not null default '{}'::text[],
  support_level text not null default 'needs_review',
  public_visibility text not null default 'backend_only',
  status text not null default 'needs_review',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_estimate_records (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.admin_draft_records(id) on delete cascade,
  workspace text not null check (workspace in ('hsv', 'veritas')),
  estimate_id text not null,
  field_name text,
  value text,
  display_value text,
  estimate_basis text,
  source_ids text[] not null default '{}'::text[],
  source_notes text,
  confidence text not null default 'unknown',
  set_by text not null default 'gem',
  last_checked date,
  next_review_due date,
  public_visible boolean not null default true,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.content_relationship_records (
  id uuid primary key default gen_random_uuid(),
  draft_id uuid references public.admin_draft_records(id) on delete cascade,
  workspace text not null check (workspace in ('hsv', 'veritas')),
  relationship_id text not null,
  from_entity text,
  relationship_type text,
  to_entity text,
  source_ids text[] not null default '{}'::text[],
  support_level text not null default 'needs_review',
  public_visibility text not null default 'backend_only',
  status text not null default 'needs_review',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  month_key text not null,
  workspace text,
  job_type text,
  route_tier text,
  provider text,
  model text,
  model_key text,
  request_name text,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  estimated_cost_usd numeric not null default 0,
  status text not null default 'unknown',
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_draft_records_workspace_status on public.admin_draft_records(workspace, status, created_at desc);
create index if not exists idx_admin_draft_records_type on public.admin_draft_records(workspace, draft_type, created_at desc);
create index if not exists idx_content_claim_records_draft on public.content_claim_records(draft_id);
create index if not exists idx_content_claim_records_visibility on public.content_claim_records(workspace, public_visibility, support_level);
create index if not exists idx_content_source_records_draft on public.content_source_records(draft_id);
create index if not exists idx_content_estimate_records_review on public.content_estimate_records(workspace, next_review_due, confidence);
create index if not exists idx_content_relationship_records_draft on public.content_relationship_records(draft_id);
create index if not exists idx_ai_usage_logs_month on public.ai_usage_logs(month_key, created_at desc);
create index if not exists idx_ai_usage_logs_provider on public.ai_usage_logs(month_key, provider, job_type);
