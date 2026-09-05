create table devotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scripture_reference text,
  body text not null,
  publish_date date,
  author_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table devotions enable row level security;

create policy "published devotions are publicly readable" on devotions
  for select using (publish_date is not null and publish_date <= current_date);
create policy "admin manages devotions" on devotions
  for all using (is_admin());
