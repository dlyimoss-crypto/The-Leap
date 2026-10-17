import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client that bypasses RLS. Only for server jobs that have no
 * signed-in user and must act across all users — currently just the
 * devotion reminder sender. Never import this from anything a user request
 * can reach without its own authorization check.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
