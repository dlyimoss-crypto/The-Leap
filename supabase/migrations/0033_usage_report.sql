-- The Leap — admin usage report: who uses the app, and who uses it
-- regularly.
--
-- admin_engagement_report's active_users only counts people who *wrote*
-- something (a post, a prayer, a commitment…), so someone who opens the app
-- daily just to read was invisible. app_visits records one row per user per
-- day they open the app (written by the proxy, at most once a day).
--
-- Visits only exist from this migration onward, so the report also folds in
-- the dates of every write-type activity — older periods still get a fair
-- (if undercounted) picture.

create table app_visits (
  user_id uuid not null references profiles(id) on delete cascade,
  visited_on date not null default current_date,
  primary key (user_id, visited_on)
);

alter table app_visits enable row level security;

create policy "owner reads own app_visits" on app_visits
  for select using (auth.uid() = user_id);
create policy "owner writes own app_visits" on app_visits
  for insert with check (auth.uid() = user_id);

-- "Regular" = active on at least 8 different days in the 30 days up to the
-- end of the period (or today, for the current period) — roughly twice a
-- week or more.
create or replace function public.admin_usage_report(
  p_start timestamptz,
  p_end timestamptz
)
returns table (
  total_users bigint,
  users_in_period bigint,
  regular_users bigint,
  devotion_readers bigint,
  reminder_subscribers bigint
)
language plpgsql
security definer
set search_path = public
as $$
declare
  -- p_end is exclusive; the window's last day is the period's last day, or
  -- today while the period is still running.
  v_last_day date := least(p_end - interval '1 microsecond', now())::date;
  v_window_start date := v_last_day - 29;
  v_window_end date := v_last_day + 1;
begin
  if not is_admin() then
    raise exception 'admin access required';
  end if;

  return query
  with activity_days as (
    select user_id, visited_on as day from app_visits
    union
    select user_id, read_at::date from devotion_reads
    union
    select user_id, read_date from devotion_archive_reads
    union
    select user_id, completed_at::date from session_completions
    union
    select user_id, created_at::date from commitments
    union
    select user_id, created_at::date from prayer_requests
    union
    select user_id, created_at::date from posts
    union
    select user_id, created_at::date from comments
    union
    select user_id, created_at::date from companion_messages
  )
  select
    (select count(*) from profiles pr where pr.created_at < p_end),
    (select count(distinct ad.user_id) from activity_days ad
      where ad.day >= p_start::date and ad.day <= v_last_day),
    (select count(*) from (
      select ad.user_id from activity_days ad
        where ad.day >= v_window_start and ad.day < v_window_end
        group by ad.user_id
        having count(distinct ad.day) >= 8
    ) as regulars),
    (select count(distinct dr.user_id) from devotion_reads dr
      where dr.read_at >= p_start and dr.read_at < p_end),
    (select count(distinct ps.user_id) from push_subscriptions ps);
end;
$$;
