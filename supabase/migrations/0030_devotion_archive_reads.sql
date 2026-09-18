-- The Leap — one archive devotion a day.
-- Today's own devotion is always free to read. Browsing the archive of
-- past devotions is limited to one pick per calendar day, so the habit
-- stays a daily rhythm rather than a backlog to binge through. One row
-- per (user, day) records which past devotion they chose; the primary
-- key makes "already picked today?" a single indexed lookup and blocks
-- a second pick from ever being inserted for the same day.

create table devotion_archive_reads (
  user_id uuid not null references profiles(id) on delete cascade,
  read_date date not null default current_date,
  devotion_id uuid not null references devotions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, read_date)
);

alter table devotion_archive_reads enable row level security;

create policy "owner reads own devotion_archive_reads" on devotion_archive_reads
  for select using (auth.uid() = user_id);
create policy "owner writes own devotion_archive_reads" on devotion_archive_reads
  for insert with check (auth.uid() = user_id);
