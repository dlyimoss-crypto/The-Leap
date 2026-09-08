-- The Leap — admin-only visibility into who signed up with which email.
-- auth.users isn't exposed through the API, and profiles is publicly
-- readable (needed to show display names/authorship everywhere), so
-- email can't just be added as a profiles column — anyone querying
-- profiles would see it. It gets its own table with a policy scoped to
-- admins only.

create table public.profile_emails (
  id uuid primary key references public.profiles(id) on delete cascade,
  email text not null
);

alter table public.profile_emails enable row level security;

create policy "admins can read profile emails" on public.profile_emails
  for select using (is_admin());

-- Extends handle_new_user (0002) to also record the signup email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  insert into public.profile_emails (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Keeps profile_emails in sync if a user's email is ever changed.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profile_emails set email = new.email where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_updated
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Backfill everyone who signed up before this migration.
insert into public.profile_emails (id, email)
select id, email from auth.users
on conflict (id) do nothing;
