-- The Leap — admin engagement report.
-- session_completions, journey_progress, commitments and companion_messages
-- are all owner-only for select (no is_admin() bypass, unlike posts/
-- prayer_requests) — they hold private reflection/prayer/journey content,
-- so this widens access to aggregate counts only, via a security definer
-- function, rather than granting admins a read policy on the raw rows.

create or replace function public.admin_engagement_report(
  p_start timestamptz,
  p_end timestamptz
)
returns table (
  new_signups bigint,
  active_users bigint,
  sessions_completed bigint,
  journeys_started bigint,
  journeys_completed bigint,
  commitments_created bigint,
  commitments_completed bigint,
  prayer_requests_count bigint,
  posts_count bigint,
  comments_count bigint,
  companion_messages_count bigint,
  gospel_prayers_count bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'admin access required';
  end if;

  return query
  select
    (select count(*) from profiles pr
      where pr.created_at >= p_start and pr.created_at < p_end),
    (select count(distinct user_id) from (
      select user_id from session_completions
        where completed_at >= p_start and completed_at < p_end
      union
      select user_id from commitments
        where created_at >= p_start and created_at < p_end
      union
      select user_id from prayer_requests
        where created_at >= p_start and created_at < p_end
      union
      select user_id from posts
        where created_at >= p_start and created_at < p_end
      union
      select user_id from comments
        where created_at >= p_start and created_at < p_end
      union
      select user_id from companion_messages
        where created_at >= p_start and created_at < p_end
    ) as active_user_ids),
    (select count(*) from session_completions sc
      where sc.completed_at >= p_start and sc.completed_at < p_end),
    (select count(*) from journey_progress jp
      where jp.started_at >= p_start and jp.started_at < p_end),
    (select count(*) from journey_progress jp
      where jp.completed_at >= p_start and jp.completed_at < p_end),
    (select count(*) from commitments c
      where c.created_at >= p_start and c.created_at < p_end),
    (select count(*) from commitments c
      where c.completed_at >= p_start and c.completed_at < p_end),
    (select count(*) from prayer_requests pr
      where pr.created_at >= p_start and pr.created_at < p_end),
    (select count(*) from posts po
      where po.created_at >= p_start and po.created_at < p_end),
    (select count(*) from comments co
      where co.created_at >= p_start and co.created_at < p_end),
    (select count(*) from companion_messages cm
      where cm.created_at >= p_start and cm.created_at < p_end),
    (select count(*) from profiles gp
      where gp.gospel_prayer_at >= p_start and gp.gospel_prayer_at < p_end);
end;
$$;
