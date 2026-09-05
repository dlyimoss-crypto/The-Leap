create table churches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lead_pastor text,
  mission text,
  address text,
  service_time text,
  phone text,
  email text,
  member_count_estimate integer,
  created_at timestamptz not null default now()
);

alter table churches enable row level security;

create policy "churches are publicly readable" on churches
  for select using (true);
create policy "admin manages churches" on churches
  for all using (is_admin());
