alter table profiles add column is_author boolean not null default false;

create table author_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  bio text not null,
  reason text not null,
  website text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','more_info_requested')),
  review_notes text,
  created_at timestamptz not null default now()
);

alter table author_applications enable row level security;

create policy "owner reads own author_applications" on author_applications
  for select using (auth.uid() = user_id);
create policy "owner creates own author_applications" on author_applications
  for insert with check (auth.uid() = user_id);
create policy "admin manages author_applications" on author_applications
  for all using (is_admin());

create or replace function public.set_user_author(
  p_user_id uuid,
  p_is_author boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'admin access required';
  end if;

  update profiles set is_author = p_is_author where id = p_user_id;
end;
$$;
