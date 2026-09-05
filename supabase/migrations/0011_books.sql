create table books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  categories text[] not null default '{}',
  manuscript_path text,
  manuscript_filename text,
  cover_path text,
  price_cents integer,
  status text not null default 'draft'
    check (status in (
      'draft','pending_review','changes_requested','rejected',
      'approved','published','unpublished'
    )),
  review_notes text,
  rights_attested_at timestamptz,
  created_at timestamptz not null default now()
);

alter table books enable row level security;

create policy "published books are publicly readable" on books
  for select using (status = 'published');
create policy "owner or admin reads own books" on books
  for select using (auth.uid() = author_id or is_admin());
create policy "owner creates own books" on books
  for insert with check (auth.uid() = author_id);
create policy "owner or admin updates books" on books
  for update using (auth.uid() = author_id or is_admin());
