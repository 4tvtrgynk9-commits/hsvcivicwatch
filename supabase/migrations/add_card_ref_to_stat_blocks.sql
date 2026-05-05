-- card_ref stores the ref_number of the parent issue card (for example "EQ-IC-1").
-- All stat blocks are children of issue cards.
-- Clicking a stat block anywhere on the platform navigates to its parent card.

ALTER TABLE stat_blocks ADD COLUMN IF NOT EXISTS card_ref text;
CREATE INDEX IF NOT EXISTS idx_stat_blocks_card_ref ON stat_blocks(card_ref);
