create extension if not exists pgcrypto;

create table if not exists research_cases (
  id uuid primary key default gen_random_uuid(),
  case_id text unique not null,
  source_type text,
  source_url text,
  source_title text,
  starting_topic text,
  status text default 'research_in_progress',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  final_recommended_module text,
  final_recommended_tab text,
  parser_status text,
  admin_review_status text default 'pending'
);

create table if not exists agent_research_outputs (
  id uuid primary key default gen_random_uuid(),
  case_id text references research_cases(case_id),
  agent_name text,
  agent_role text,
  model_used text,
  raw_output jsonb,
  suggested_title text,
  suggested_module text,
  suggested_tab text,
  suggested_issue_angle text,
  suggested_stats jsonb,
  sources jsonb,
  confidence_score numeric,
  created_at timestamptz default now()
);

create table if not exists merged_research_packets (
  id uuid primary key default gen_random_uuid(),
  case_id text references research_cases(case_id),
  canonical_topic text,
  merged_facts jsonb,
  confirmed_sources jsonb,
  conflicting_claims jsonb,
  missing_fields jsonb,
  recommended_module text,
  recommended_tab text,
  recommended_title text,
  recommended_issue_cards jsonb,
  recommended_stat_blocks jsonb,
  ready_for_parser boolean default false,
  created_at timestamptz default now()
);

create table if not exists issue_card_drafts (
  id uuid primary key default gen_random_uuid(),
  case_id text,
  ref_number text,
  module text,
  tab text,
  tabs jsonb,
  label text,
  title text,
  summary text,
  homepage_teaser text,
  details text,
  sources jsonb,
  decoder jsonb,
  actions jsonb,
  stat_blocks jsonb,
  visual_config jsonb,
  inline_visual_config jsonb,
  checklist_status jsonb,
  parser_alerts jsonb,
  linked_profiles jsonb,
  admin_status text default 'pending_review',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profile_cases (
  id uuid primary key default gen_random_uuid(),
  profile_case_id text unique not null,
  person_name text,
  office_title text,
  jurisdiction text,
  profile_type text,
  status text default 'research_in_progress',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  admin_review_status text default 'pending'
);

create table if not exists profile_research_outputs (
  id uuid primary key default gen_random_uuid(),
  profile_case_id text references profile_cases(profile_case_id),
  agent_name text,
  agent_role text,
  model_used text,
  raw_output jsonb,
  sources jsonb,
  confidence_score numeric,
  created_at timestamptz default now()
);

create table if not exists profile_drafts (
  id uuid primary key default gen_random_uuid(),
  profile_case_id text,
  profile_type text,
  full_name text,
  display_name text,
  title text,
  jurisdiction text,
  district_or_seat text,
  term_start text,
  term_end text,
  next_election text,
  contact_info jsonb,
  bio jsonb,
  career_history jsonb,
  education jsonb,
  campaign_finance jsonb,
  donors jsonb,
  ethics_disclosures jsonb,
  votes_actions jsonb,
  appointments jsonb,
  board_ties jsonb,
  business_ties jsonb,
  public_controversies jsonb,
  decoder jsonb,
  sources jsonb,
  checklist_status jsonb,
  parser_alerts jsonb,
  linked_issue_cards jsonb,
  admin_status text default 'pending_review',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profile_issue_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid,
  issue_card_id uuid,
  profile_ref text,
  issue_ref text,
  relationship_type text,
  role_in_issue text,
  source text,
  created_at timestamptz default now(),
  constraint profile_issue_links_relationship_type_check check (
    relationship_type is null or relationship_type in (
      'named official',
      'voted on this',
      'approved this',
      'benefited',
      'donor connection',
      'contract connection',
      'board connection',
      'campaign finance connection',
      'ethics complaint',
      'public statement',
      'oversight authority',
      'affected agency'
    )
  )
);

create index if not exists agent_research_outputs_case_id_idx on agent_research_outputs(case_id);
create index if not exists merged_research_packets_case_id_idx on merged_research_packets(case_id);
create index if not exists issue_card_drafts_case_id_idx on issue_card_drafts(case_id);
create index if not exists issue_card_drafts_admin_status_idx on issue_card_drafts(admin_status);
create index if not exists profile_research_outputs_case_id_idx on profile_research_outputs(profile_case_id);
create index if not exists profile_drafts_case_id_idx on profile_drafts(profile_case_id);
create index if not exists profile_drafts_admin_status_idx on profile_drafts(admin_status);
create index if not exists profile_issue_links_profile_ref_idx on profile_issue_links(profile_ref);
create index if not exists profile_issue_links_issue_ref_idx on profile_issue_links(issue_ref);

alter table if exists issue_cards add column if not exists case_id text;
alter table if exists issue_cards add column if not exists inline_visual_config jsonb;
alter table if exists stat_blocks add column if not exists case_id text;
alter table if exists official_profiles add column if not exists profile_case_id text;
alter table if exists board_profiles add column if not exists profile_case_id text;
alter table if exists school_profiles add column if not exists profile_case_id text;

alter table research_cases enable row level security;
alter table agent_research_outputs enable row level security;
alter table merged_research_packets enable row level security;
alter table issue_card_drafts enable row level security;
alter table profile_cases enable row level security;
alter table profile_research_outputs enable row level security;
alter table profile_drafts enable row level security;
alter table profile_issue_links enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'research_cases',
    'agent_research_outputs',
    'merged_research_packets',
    'issue_card_drafts',
    'profile_cases',
    'profile_research_outputs',
    'profile_drafts',
    'profile_issue_links'
  ]
  loop
    execute format('drop policy if exists "%I_authenticated_read" on %I', table_name, table_name);
    execute format('drop policy if exists "%I_authenticated_write" on %I', table_name, table_name);
    execute format('create policy "%I_authenticated_read" on %I for select to authenticated using (true)', table_name, table_name);
    execute format('create policy "%I_authenticated_write" on %I for all to authenticated using (true) with check (true)', table_name, table_name);
  end loop;
end $$;
