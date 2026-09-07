-- The weekly commitment moves from a free-text goal to a fixed three-item
-- checklist (scripture, prayer, witness) — every user commits to the same
-- three practices, so "kept" now means all three are checked rather than
-- the user's own honesty about a self-written sentence. `body` stays for
-- existing rows and because it's still a handy one-line summary in history
-- lists, but new rows always write the same fixed sentence.
alter table commitments
  add column scripture_done boolean not null default false,
  add column prayer_done boolean not null default false,
  add column witness_done boolean not null default false;
