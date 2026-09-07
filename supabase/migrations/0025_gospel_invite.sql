-- Tracks the "Do You Know Jesus?" gospel invitation shown once on a
-- user's first Home visit. `gospel_prayer_at` records that someone tapped
-- "I Prayed This Prayer" — a self-reported response for pastoral visibility,
-- never a claim the app makes about a person's actual spiritual condition.
alter table profiles add column gospel_invite_shown_at timestamptz;
alter table profiles add column gospel_prayer_at timestamptz;

-- Additive: 0006 already scoped `authenticated`'s UPDATE grant to a
-- specific column list (revoking the blanket table-level grant first) —
-- this just adds these two self-service columns to that same allowlist.
grant update (gospel_invite_shown_at, gospel_prayer_at) on public.profiles to authenticated;
