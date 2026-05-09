-- Structured Packet → Admin Review Queue bridge
-- Safe to run more than once.

alter table if exists public.issue_card_drafts
  add column if not exists structured_admin_draft_id uuid;

create index if not exists idx_issue_card_drafts_structured_admin_draft_id
  on public.issue_card_drafts (structured_admin_draft_id);

comment on column public.issue_card_drafts.structured_admin_draft_id is
  'Optional link back to admin_draft_records.id for structured packet iake records.';

alter table if exists public.admin_draft_records
  add column if not exists sent_to_review_at timestamptz;

comment on column public.admin_draft_records.sent_to_review_at is
  'Timestamp when a structured draft was sent into the legacy issue_card_drafts review queue.';
