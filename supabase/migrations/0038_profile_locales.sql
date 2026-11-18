-- The Leap — multilingual phase 1: language codes and sign-up language.
--
-- 1. Widen profiles.preferred_language to the app's locale list
--    (src/lib/i18n/locales.ts): adds 'es', and renames the original 'zh'
--    to 'zh-CN' (Simplified Chinese). No one can have picked 'zh' (the
--    app never offered it), but any such row becomes 'zh-CN' rather than
--    failing the new check.
-- 2. handle_new_user (0002, extended by 0027 and 0029) now starts a new
--    profile in the language chosen before signing up, passed by the app
--    as user metadata. Anything not on the list falls back to 'en'.
--
-- Additive only: existing values other than 'zh' are untouched.

alter table public.profiles
  drop constraint if exists profiles_preferred_language_check;

update public.profiles
  set preferred_language = 'zh-CN'
  where preferred_language = 'zh';

alter table public.profiles
  add constraint profiles_preferred_language_check
  check (preferred_language in ('en', 'sw', 'de', 'fr', 'es', 'zh-CN'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_language text := new.raw_user_meta_data ->> 'preferred_language';
begin
  insert into public.profiles (id, display_name, preferred_language)
  values (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    case
      when chosen_language in ('en', 'sw', 'de', 'fr', 'es', 'zh-CN')
        then chosen_language
      else 'en'
    end
  );
  insert into public.profile_emails (id, email, nationality)
  values (new.id, new.email, new.raw_user_meta_data ->> 'nationality');
  return new;
end;
$$;
