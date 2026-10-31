-- Ask PD: a user can reach Pastor Deniss (PD) and the PD team, the
-- pastors and coaches he approves, directly. Either a private message
-- thread or a call request (PD's team gets in touch outside the app).
--
-- A real person replies, so unlike the Leap Companion this is a human
-- channel. Users see only their own requests; the PD team (role 'pastor'
-- or 'admin') sees and answers all of them.

-- ── PD team role ──────────────────────────────────────────────────────────
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('user', 'pastor', 'admin'));

create or replace function public.is_pd_team()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role in ('pastor', 'admin')
  );
$$;

-- Admins add/remove pastors. profiles.role isn't user-writable (0006), so
-- this goes through a security definer function, like set_user_banned.
-- Admins themselves are left alone: they're always on the team.
create or replace function public.set_pd_team_member(
  p_user_id uuid,
  p_is_member boolean
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

  update profiles
  set role = case when p_is_member then 'pastor' else 'user' end
  where id = p_user_id and role <> 'admin';
end;
$$;

-- ── Requests and their messages ───────────────────────────────────────────
create table ask_pd_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null check (kind in ('message', 'call')),
  status text not null default 'open'
    check (status in ('open', 'answered', 'closed')),
  -- Call requests only: how and when the user would like to be reached.
  contact_method text check (contact_method in ('whatsapp', 'phone', 'video')),
  contact_detail text check (char_length(contact_detail) <= 200),
  preferred_time text check (char_length(preferred_time) <= 200),
  -- A copy of the user's recent Leap Companion messages, taken only when
  -- they ticked "share my Companion conversation". Null otherwise.
  companion_snapshot jsonb,
  user_unread boolean not null default false,
  team_unread boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ask_pd_requests_user_id_idx on ask_pd_requests (user_id, updated_at desc);
create index ask_pd_requests_status_idx on ask_pd_requests (status, updated_at desc);

create table ask_pd_messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references ask_pd_requests(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  from_team boolean not null default false,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);

create index ask_pd_messages_request_id_idx on ask_pd_messages (request_id, created_at);

alter table ask_pd_requests enable row level security;
alter table ask_pd_messages enable row level security;

create policy "users read own ask_pd_requests; team reads all" on ask_pd_requests
  for select using (auth.uid() = user_id or is_pd_team());
create policy "users open their own ask_pd_requests" on ask_pd_requests
  for insert with check (
    auth.uid() = user_id and status = 'open' and team_unread and not user_unread
  );
create policy "team updates ask_pd_requests" on ask_pd_requests
  for update using (is_pd_team());

create policy "read messages of visible ask_pd_requests" on ask_pd_messages
  for select using (
    is_pd_team() or exists (
      select 1 from ask_pd_requests r
      where r.id = ask_pd_messages.request_id and r.user_id = auth.uid()
    )
  );
create policy "users write to own open ask_pd_requests" on ask_pd_messages
  for insert with check (
    not from_team and author_id = auth.uid() and exists (
      select 1 from ask_pd_requests r
      where r.id = ask_pd_messages.request_id
        and r.user_id = auth.uid()
        and r.status <> 'closed'
    )
  );
create policy "team replies to ask_pd_requests" on ask_pd_messages
  for insert with check (from_team and author_id = auth.uid() and is_pd_team());

-- Each new message flips who has something unread and the request's
-- status, so neither side has to remember to.
create or replace function public.ask_pd_after_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.from_team then
    update ask_pd_requests
    set status = 'answered', user_unread = true, team_unread = false,
        updated_at = now()
    where id = new.request_id;
  else
    update ask_pd_requests
    set status = 'open', team_unread = true, updated_at = now()
    where id = new.request_id;
  end if;
  return new;
end;
$$;

create trigger ask_pd_after_message
  after insert on ask_pd_messages
  for each row execute function public.ask_pd_after_message();

-- The user marks a reply as read (they can't update requests directly).
create or replace function public.mark_ask_pd_read(p_request_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update ask_pd_requests set user_unread = false
  where id = p_request_id and user_id = auth.uid();
$$;
