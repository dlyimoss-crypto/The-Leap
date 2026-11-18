-- The Leap — multilingual phase 3: translations of journeys, journey days,
-- devotions and announcements.
--
-- Design (see .scratch/multilingual/spec.md §C3, decisions in §K):
-- - One translations table per content type, beside the English source.
--   English rows are never written by anything here; deleting a source row
--   deletes its translations.
-- - Every source row gets a content_version that goes up whenever its
--   translatable text changes. A translation stores the source_version it
--   was made from, so "outdated" = source_version < content_version. It is
--   computed, not a status: an outdated *published* translation keeps
--   being served (decision K2) while admins see it flagged.
-- - Readers only ever see `published` translations of content they can
--   already see (the exists() checks run under the source table's RLS).
--   Admins manage everything. Nothing is published automatically.
-- - Every status change is written to localization_events by trigger, so
--   the audit trail can't be skipped by any client.
--
-- Additive only: safe to apply before the code that uses it is deployed.

-- ── Status ───────────────────────────────────────────────────────────────
create type public.localization_status as enum (
  'pending',          -- requested, nothing written yet
  'translating',      -- an AI job is working on it
  'awaiting_review',  -- draft ready for an admin
  'needs_revision',   -- admin sent it back
  'approved',         -- checked, not yet live
  'published'         -- live for readers
);

-- Languages that can hold translations: every app locale except English,
-- which is the source (src/lib/i18n/locales.ts).
create or replace function public.is_translation_locale(code text)
returns boolean
language sql
immutable
as $$ select code in ('sw', 'de', 'fr', 'es', 'zh-CN') $$;

-- ── Source versions ──────────────────────────────────────────────────────
alter table public.journeys add column content_version integer not null default 1;
alter table public.journey_days add column content_version integer not null default 1;
alter table public.devotions add column content_version integer not null default 1;
alter table public.prayer_movements add column content_version integer not null default 1;

create or replace function public.bump_journey_version() returns trigger
language plpgsql as $$
begin
  if (new.title, new.purpose, new.teaser, new.completion_title)
     is distinct from (old.title, old.purpose, old.teaser, old.completion_title) then
    new.content_version := old.content_version + 1;
  end if;
  return new;
end $$;

create or replace function public.bump_journey_day_version() returns trigger
language plpgsql as $$
begin
  if (new.title, new.message, new.explore, new.reflect, new.pray, new.next_topic)
     is distinct from (old.title, old.message, old.explore, old.reflect, old.pray, old.next_topic) then
    new.content_version := old.content_version + 1;
  end if;
  return new;
end $$;

create or replace function public.bump_devotion_version() returns trigger
language plpgsql as $$
begin
  if (new.title, new.body, new.reflection, new.prayer, new.practice)
     is distinct from (old.title, old.body, old.reflection, old.prayer, old.practice) then
    new.content_version := old.content_version + 1;
  end if;
  return new;
end $$;

create or replace function public.bump_announcement_version() returns trigger
language plpgsql as $$
begin
  if (new.title, new.body, new.link_label, new.prayer_points)
     is distinct from (old.title, old.body, old.link_label, old.prayer_points) then
    new.content_version := old.content_version + 1;
  end if;
  return new;
end $$;

create trigger journeys_bump_version before update on public.journeys
  for each row execute function public.bump_journey_version();
create trigger journey_days_bump_version before update on public.journey_days
  for each row execute function public.bump_journey_day_version();
create trigger devotions_bump_version before update on public.devotions
  for each row execute function public.bump_devotion_version();
create trigger prayer_movements_bump_version before update on public.prayer_movements
  for each row execute function public.bump_announcement_version();

-- ── Translation tables ───────────────────────────────────────────────────
-- Text columns mirror the source's nullability: a published translation
-- of a field the source requires can't be empty.

create table public.journey_localizations (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references public.journeys(id) on delete cascade,
  locale text not null check (public.is_translation_locale(locale)),
  title text,
  purpose text,
  teaser text,
  completion_title text,
  status public.localization_status not null default 'pending',
  source_version integer not null,
  origin text not null default 'ai' check (origin in ('ai', 'human')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  translator_notes text, -- AI's notes for the reviewer (uncertain terms, Bible quotations)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, locale),
  check (status not in ('approved', 'published')
         or (title is not null and purpose is not null and completion_title is not null))
);

create table public.journey_day_localizations (
  id uuid primary key default gen_random_uuid(),
  journey_day_id uuid not null references public.journey_days(id) on delete cascade,
  locale text not null check (public.is_translation_locale(locale)),
  title text,
  message text,
  explore text,
  reflect text,
  pray text,
  next_topic text,
  status public.localization_status not null default 'pending',
  source_version integer not null,
  origin text not null default 'ai' check (origin in ('ai', 'human')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  translator_notes text, -- AI's notes for the reviewer (uncertain terms, Bible quotations)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_day_id, locale),
  check (status not in ('approved', 'published')
         or (title is not null and message is not null and explore is not null and reflect is not null))
);

create table public.devotion_localizations (
  id uuid primary key default gen_random_uuid(),
  devotion_id uuid not null references public.devotions(id) on delete cascade,
  locale text not null check (public.is_translation_locale(locale)),
  title text,
  body text,
  reflection text,
  prayer text,
  practice text,
  status public.localization_status not null default 'pending',
  source_version integer not null,
  origin text not null default 'ai' check (origin in ('ai', 'human')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  translator_notes text, -- AI's notes for the reviewer (uncertain terms, Bible quotations)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (devotion_id, locale),
  check (status not in ('approved', 'published') or (title is not null and body is not null))
);

create table public.announcement_localizations (
  id uuid primary key default gen_random_uuid(),
  announcement_id uuid not null references public.prayer_movements(id) on delete cascade,
  locale text not null check (public.is_translation_locale(locale)),
  title text,
  body text,
  link_label text,
  prayer_points text[],
  status public.localization_status not null default 'pending',
  source_version integer not null,
  origin text not null default 'ai' check (origin in ('ai', 'human')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  review_note text,
  translator_notes text, -- AI's notes for the reviewer (uncertain terms, Bible quotations)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (announcement_id, locale),
  check (status not in ('approved', 'published') or title is not null)
);

-- Readers look these up by source id + locale; the unique constraints
-- above already index exactly that.

-- ── Access ───────────────────────────────────────────────────────────────
alter table public.journey_localizations enable row level security;
alter table public.journey_day_localizations enable row level security;
alter table public.devotion_localizations enable row level security;
alter table public.announcement_localizations enable row level security;

create policy "published journey translations are readable" on public.journey_localizations
  for select using (
    status = 'published'
    and exists (select 1 from public.journeys j where j.id = journey_id)
  );
create policy "admin manages journey translations" on public.journey_localizations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "published journey day translations are readable" on public.journey_day_localizations
  for select using (
    status = 'published'
    and exists (select 1 from public.journey_days d where d.id = journey_day_id)
  );
create policy "admin manages journey day translations" on public.journey_day_localizations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "published devotion translations are readable" on public.devotion_localizations
  for select using (
    status = 'published'
    and exists (select 1 from public.devotions d where d.id = devotion_id)
  );
create policy "admin manages devotion translations" on public.devotion_localizations
  for all using (public.is_admin()) with check (public.is_admin());

create policy "published announcement translations are readable" on public.announcement_localizations
  for select using (
    status = 'published'
    and exists (select 1 from public.prayer_movements m where m.id = announcement_id)
  );
create policy "admin manages announcement translations" on public.announcement_localizations
  for all using (public.is_admin()) with check (public.is_admin());

-- ── Audit log ────────────────────────────────────────────────────────────
create table public.localization_events (
  id bigint generated always as identity primary key,
  content_type text not null
    check (content_type in ('journey', 'journey_day', 'devotion', 'announcement')),
  localization_id uuid not null,
  source_id uuid not null,
  locale text not null,
  from_status public.localization_status,
  to_status public.localization_status not null,
  source_version integer not null,
  actor uuid references public.profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

create index localization_events_lookup
  on public.localization_events (content_type, source_id, locale, created_at desc);

alter table public.localization_events enable row level security;
create policy "admin reads localization events" on public.localization_events
  for select using (public.is_admin());
-- No insert/update/delete policies: rows are written only by the trigger
-- below (security definer), and never changed afterwards.

create or replace function public.log_localization_event() returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  kind text := tg_argv[0];
  -- Each table names its source column differently; read it generically
  -- (a direct new.journey_id would fail on the other tables).
  src uuid := (to_jsonb(new) ->> case kind
    when 'journey' then 'journey_id'
    when 'journey_day' then 'journey_day_id'
    when 'devotion' then 'devotion_id'
    else 'announcement_id'
  end)::uuid;
begin
  new.updated_at := now();
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into public.localization_events
      (content_type, localization_id, source_id, locale, from_status, to_status, source_version, actor, note)
    values
      (kind, new.id, src, new.locale,
       case when tg_op = 'UPDATE' then old.status end,
       new.status, new.source_version, auth.uid(), new.review_note);
  end if;
  return new;
end $$;

create trigger journey_localizations_log before insert or update on public.journey_localizations
  for each row execute function public.log_localization_event('journey');
create trigger journey_day_localizations_log before insert or update on public.journey_day_localizations
  for each row execute function public.log_localization_event('journey_day');
create trigger devotion_localizations_log before insert or update on public.devotion_localizations
  for each row execute function public.log_localization_event('devotion');
create trigger announcement_localizations_log before insert or update on public.announcement_localizations
  for each row execute function public.log_localization_event('announcement');
