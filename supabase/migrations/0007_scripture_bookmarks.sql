create table scripture_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  reference text not null,
  translation text not null default 'WEB',
  created_at timestamptz not null default now(),
  unique (user_id, reference, translation)
);

alter table scripture_bookmarks enable row level security;

create policy "owner reads own scripture_bookmarks" on scripture_bookmarks
  for select using (auth.uid() = user_id);
create policy "owner writes own scripture_bookmarks" on scripture_bookmarks
  for all using (auth.uid() = user_id);
