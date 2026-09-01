-- The Leap — V1 schema
-- Reflects decisions from wayfinder tickets 02, 04, 06, 08 (.scratch/the-leap-mvp/)

create extension if not exists "pgcrypto";

-- profiles extends auth.users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_language text not null default 'en'
    check (preferred_language in ('en','sw','fr','de','zh')),
  role text not null default 'user'
    check (role in ('user','admin')),
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

create table journey_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  journey_slug text not null,
  current_session_number int not null default 1,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, journey_slug)
);

create table session_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  journey_slug text not null,
  session_number int not null,
  completed_at timestamptz not null default now(),
  unique (user_id, journey_slug, session_number)
);

create table reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  journey_slug text,
  session_number int,
  prompt text,
  body text not null,
  created_at timestamptz not null default now()
);

create table commitments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  status text not null default 'active' check (status in ('active','completed')),
  week_of date not null default date_trunc('week', now())::date,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  visibility text not null default 'public' check (visibility in ('public','private')),
  is_anonymous boolean not null default false,
  status text not null default 'open' check (status in ('open','answered','hidden','removed')),
  testimony text,
  created_at timestamptz not null default now()
);

create table prayer_responses (
  id uuid primary key default gen_random_uuid(),
  prayer_request_id uuid not null references prayer_requests(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (prayer_request_id, user_id)
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible','hidden','removed')),
  created_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible','hidden','removed')),
  created_at timestamptz not null default now()
);

create table reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null check (type in ('encourage','pray')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id, type)
);

create table blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid not null references profiles(id) on delete cascade,
  blocked_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles(id) on delete cascade,
  target_type text not null check (target_type in ('post','comment','prayer_request','user')),
  target_id uuid not null,
  reason text,
  status text not null default 'open' check (status in ('open','resolved')),
  resolution text check (resolution in ('restored','removed')),
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table companion_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  conversation_id uuid not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Row level security

alter table profiles enable row level security;
alter table journey_progress enable row level security;
alter table session_completions enable row level security;
alter table reflections enable row level security;
alter table commitments enable row level security;
alter table prayer_requests enable row level security;
alter table prayer_responses enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table reactions enable row level security;
alter table blocks enable row level security;
alter table reports enable row level security;
alter table notifications enable row level security;
alter table companion_messages enable row level security;

-- profiles: readable by anyone (needed to show author names), writable only by owner
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users manage their own profile" on profiles for update using (auth.uid() = id);

-- owner-only tables
create policy "owner reads own journey_progress" on journey_progress for select using (auth.uid() = user_id);
create policy "owner writes own journey_progress" on journey_progress for all using (auth.uid() = user_id);

create policy "owner reads own session_completions" on session_completions for select using (auth.uid() = user_id);
create policy "owner writes own session_completions" on session_completions for all using (auth.uid() = user_id);

create policy "owner reads own reflections" on reflections for select using (auth.uid() = user_id);
create policy "owner writes own reflections" on reflections for all using (auth.uid() = user_id);

create policy "owner reads own commitments" on commitments for select using (auth.uid() = user_id);
create policy "owner writes own commitments" on commitments for all using (auth.uid() = user_id);

create policy "owner reads own companion_messages" on companion_messages for select using (auth.uid() = user_id);
create policy "owner writes own companion_messages" on companion_messages for all using (auth.uid() = user_id);

create policy "owner reads own notifications" on notifications for select using (auth.uid() = user_id);
create policy "owner updates own notifications" on notifications for update using (auth.uid() = user_id);

-- prayer_requests: owner, or public-and-not-hidden
create policy "read own or public prayer_requests" on prayer_requests for select
  using (auth.uid() = user_id or (visibility = 'public' and status not in ('hidden','removed')) or is_admin());
create policy "owner writes own prayer_requests" on prayer_requests for insert with check (auth.uid() = user_id);
create policy "owner updates own prayer_requests" on prayer_requests for update using (auth.uid() = user_id or is_admin());

create policy "read prayer_responses on visible requests" on prayer_responses for select using (true);
create policy "authenticated users add prayer_responses" on prayer_responses for insert with check (auth.uid() = user_id);

-- posts/comments: visible to all if status = visible, owner/admin can see their own regardless
create policy "read visible posts" on posts for select
  using (status = 'visible' or auth.uid() = user_id or is_admin());
create policy "owner writes own posts" on posts for insert with check (auth.uid() = user_id);
create policy "owner or admin updates posts" on posts for update using (auth.uid() = user_id or is_admin());

create policy "read visible comments" on comments for select
  using (status = 'visible' or auth.uid() = user_id or is_admin());
create policy "owner writes own comments" on comments for insert with check (auth.uid() = user_id);
create policy "owner or admin updates comments" on comments for update using (auth.uid() = user_id or is_admin());

create policy "read reactions" on reactions for select using (true);
create policy "authenticated users add reactions" on reactions for insert with check (auth.uid() = user_id);
create policy "owner removes own reactions" on reactions for delete using (auth.uid() = user_id);

-- blocks: owner-only
create policy "owner reads own blocks" on blocks for select using (auth.uid() = blocker_id);
create policy "owner writes own blocks" on blocks for all using (auth.uid() = blocker_id);

-- reports: reporter or admin
create policy "reporter or admin reads reports" on reports for select using (auth.uid() = reporter_id or is_admin());
create policy "authenticated users file reports" on reports for insert with check (auth.uid() = reporter_id);
create policy "admin updates reports" on reports for update using (is_admin());
