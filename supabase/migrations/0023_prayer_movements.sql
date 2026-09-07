-- A prayer movement is a single admin-curated cause (e.g. "Let's pray for
-- Nepal") featured in the Prayer Room, distinct from member-submitted
-- prayer_requests: it carries a scripture and a list of prayer points, and
-- only one is "active" (featured) at a time — mirrors the single-active-row
-- pattern already used for commitments.
create table prayer_movements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scripture_reference text,
  prayer_points text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now()
);

-- One row per (movement, user) — "I have prayed" for this movement. Public
-- reads let anyone add up the participant count without extra RLS
-- exceptions, same as prayer_responses.
create table prayer_movement_participants (
  movement_id uuid not null references prayer_movements(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (movement_id, user_id)
);

alter table prayer_movements enable row level security;
alter table prayer_movement_participants enable row level security;

create policy "active prayer movements are publicly readable" on prayer_movements
  for select using (status = 'active');
create policy "admin manages prayer_movements" on prayer_movements
  for all using (is_admin());

create policy "read prayer_movement_participants" on prayer_movement_participants
  for select using (true);
create policy "authenticated users add prayer_movement_participants" on prayer_movement_participants
  for insert with check (auth.uid() = user_id);
