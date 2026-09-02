-- The Leap — admin ban/unban.
-- profiles' only update policy is owner-only (auth.uid() = id), so an
-- admin banning someone else needs a security definer path, same reason
-- report_content() exists for reports/posts/comments/prayer_requests.

create or replace function public.set_user_banned(
  p_user_id uuid,
  p_is_banned boolean
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

  update profiles set is_banned = p_is_banned where id = p_user_id;
end;
$$;
