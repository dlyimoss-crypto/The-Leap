-- Admin-authored directory of ways to serve (Engage tab), same shape as
-- the churches directory: draft/published like journeys, since these are
-- authored ahead of time rather than always-visible like a church listing.
create table service_opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  location text,
  contact_email text,
  contact_phone text,
  link text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table service_opportunities enable row level security;

create policy "published service opportunities are publicly readable" on service_opportunities
  for select using (status = 'published');

create policy "admin manages service opportunities" on service_opportunities
  for all using (is_admin());
