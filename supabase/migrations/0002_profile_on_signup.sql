-- The Leap — create a profiles row whenever a new auth.users row appears.
-- profiles has no INSERT policy (by design — see ticket 02), so this has to
-- run as security definer rather than rely on a client-side insert.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
