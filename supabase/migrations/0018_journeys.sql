create table journeys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  purpose text not null,
  duration_days integer not null,
  completion_title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table journey_days (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  day_number integer not null,
  title text not null,
  scripture_reference text not null,
  explore text not null,
  reflect text not null,
  pray text,
  practice text not null,
  connect text not null,
  next_topic text,
  unique (journey_id, day_number)
);

alter table journeys enable row level security;
alter table journey_days enable row level security;

create policy "published journeys are publicly readable" on journeys
  for select using (status = 'published');

create policy "admin manages journeys" on journeys
  for all using (is_admin());

create policy "days of published journeys are publicly readable" on journey_days
  for select using (
    exists (
      select 1 from journeys j
      where j.id = journey_days.journey_id and j.status = 'published'
    )
  );

create policy "admin manages journey_days" on journey_days
  for all using (is_admin());
