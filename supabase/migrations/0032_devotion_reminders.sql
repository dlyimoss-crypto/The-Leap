-- The Leap — daily devotion reminders.
--
-- devotion_reads records that a user opened a given devotion, so the home
-- screen can mark today's as unread and the reminder job can skip anyone
-- who has already read it. Keyed by devotion rather than date, so "today"
-- never has to agree across time zones.
--
-- push_subscriptions holds one row per browser/device that opted in to
-- reminders, with the hour (in the device's own time zone) to send at.
-- last_sent_on is that local date, so the hourly job sends at most one
-- reminder per device per day.

create table devotion_reads (
  user_id uuid not null references profiles(id) on delete cascade,
  devotion_id uuid not null references devotions(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (user_id, devotion_id)
);

alter table devotion_reads enable row level security;

create policy "owner reads own devotion_reads" on devotion_reads
  for select using (auth.uid() = user_id);
create policy "owner writes own devotion_reads" on devotion_reads
  for insert with check (auth.uid() = user_id);

create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  remind_hour smallint not null default 7 check (remind_hour between 0 and 23),
  time_zone text not null default 'UTC',
  last_sent_on date,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_id_idx on push_subscriptions (user_id);

alter table push_subscriptions enable row level security;

create policy "owner manages own push_subscriptions" on push_subscriptions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A browser's push endpoint is unique, but if a second person signs in on
-- the same browser and opts in, the row still belongs to the first — and
-- RLS won't let the newcomer take it over. This hands the endpoint to the
-- caller, replacing any previous owner's row.
create or replace function public.save_push_subscription(
  p_endpoint text,
  p_p256dh text,
  p_auth text,
  p_remind_hour smallint,
  p_time_zone text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'sign-in required';
  end if;

  insert into push_subscriptions (
    user_id, endpoint, p256dh, auth, remind_hour, time_zone
  )
  values (
    auth.uid(), p_endpoint, p_p256dh, p_auth, p_remind_hour, p_time_zone
  )
  on conflict (endpoint) do update set
    user_id = excluded.user_id,
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    remind_hour = excluded.remind_hour,
    time_zone = excluded.time_zone,
    last_sent_on = case
      when push_subscriptions.user_id = excluded.user_id
        then push_subscriptions.last_sent_on
    end;
end;
$$;
