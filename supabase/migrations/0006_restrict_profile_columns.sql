-- The Leap — restrict which profiles columns a user can write directly.
-- The "users manage their own profile" UPDATE policy on profiles (0001)
-- only restricts *which row* (auth.uid() = id) — RLS's USING/WITH CHECK
-- has no way to express "these columns but not those" on its own. Without
-- this, any authenticated user could set their own role to 'admin' or
-- flip is_banned back to false directly from the browser, bypassing the
-- set_user_banned() RPC (0005) and the /admin role gate entirely.
--
-- Column-level GRANTs are the idiomatic Postgres mechanism for this —
-- security definer functions (set_user_banned, handle_new_user) run as
-- their owner and are unaffected by the caller's own grants.

revoke update on public.profiles from authenticated;
grant update (display_name, avatar_url, preferred_language) on public.profiles to authenticated;
