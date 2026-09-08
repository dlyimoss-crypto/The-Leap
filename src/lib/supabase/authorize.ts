import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";

/**
 * A page's root layout and the page itself each need the current user, and
 * layout can't pass data down into the page it wraps — so without dedup
 * every request paid for auth.getUser()'s network round trip (a real call to
 * Supabase Auth, not a local JWT decode) two or three times over. `cache()`
 * makes every caller within one request share the same in-flight call.
 */
export const getAuthedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
});

/**
 * Same dedup, for the profile row that authorization checks (role,
 * is_banned) live on — layout's admin-nav check and a page's own
 * requireActiveUser/requireAdmin call used to each run their own separate
 * query for the same row.
 */
export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("role, is_banned, preferred_language")
    .eq("id", userId)
    .maybeSingle();

  return data;
});

export async function requireUser() {
  const { supabase, user } = await getAuthedUser();

  if (!user) {
    redirect("/sign-in");
  }

  return { supabase, user };
}

/**
 * Like requireUser, but also fails closed on a banned (or unverifiable)
 * profile — for actions that create content (ticket 08: "a banned user
 * can't create posts, comments, prayer requests, or reactions").
 */
export async function requireActiveUser(redirectTo: string) {
  const { supabase, user } = await requireUser();

  const profile = await getProfile(user.id);

  if (!profile || profile.is_banned) {
    redirect(redirectTo);
  }

  return { supabase, user };
}

/**
 * Like requireUser, but also redirects a non-admin away — for the /admin
 * page and every action it exposes, so both enforce the same rule.
 */
export async function requireAdmin(redirectTo = "/") {
  const { supabase, user } = await requireUser();

  const profile = await getProfile(user.id);

  if (!profile || profile.role !== "admin") {
    redirect(redirectTo);
  }

  return { supabase, user };
}
