import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", user.id)
    .single();

  if (error || profile?.is_banned) {
    redirect(redirectTo);
  }

  return { supabase, user };
}
