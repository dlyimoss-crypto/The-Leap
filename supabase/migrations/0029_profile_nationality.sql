-- The Leap — capture nationality at signup, shown to admins beside email.
-- Lives on profile_emails (admin-only read via is_admin(), see 0027)
-- rather than on profiles: profiles is publicly readable for
-- display_name/avatar everywhere, and nationality doesn't need that
-- exposure — it's admin-facing user info, same as email.

alter table public.profile_emails
  add column nationality text;

-- Extends handle_new_user (0002, extended by 0027) to also record the
-- ISO 3166-1 alpha-2 code chosen at signup (src/lib/countries.ts).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  insert into public.profile_emails (id, email, nationality)
  values (new.id, new.email, new.raw_user_meta_data ->> 'nationality');
  return new;
end;
$$;
