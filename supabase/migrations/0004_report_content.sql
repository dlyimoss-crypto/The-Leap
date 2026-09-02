-- The Leap — reporting content you don't own.
-- Ticket 08: "reporting a post, comment, or prayer request immediately
-- flips its status to hidden and creates a reports row." The existing
-- update policies on posts/comments/prayer_requests only allow the owner
-- or an admin to change status, so a reporter (neither) needs a security
-- definer path to flip someone else's content to hidden.

create or replace function public.report_content(
  p_target_type text,
  p_target_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  if p_target_type not in ('post', 'comment', 'prayer_request') then
    raise exception 'invalid target_type: %', p_target_type;
  end if;

  insert into reports (reporter_id, target_type, target_id, reason)
  values (auth.uid(), p_target_type, p_target_id, p_reason);

  if p_target_type = 'post' then
    update posts set status = 'hidden' where id = p_target_id;
  elsif p_target_type = 'comment' then
    update comments set status = 'hidden' where id = p_target_id;
  elsif p_target_type = 'prayer_request' then
    update prayer_requests set status = 'hidden' where id = p_target_id;
  end if;
end;
$$;
