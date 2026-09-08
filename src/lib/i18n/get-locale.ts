import { cache } from "react";
import { getAuthedUser, getProfile } from "@/lib/supabase/authorize";
import type { Locale } from "./dictionaries";

// Guests always get English — no cookie mechanism yet, since the only
// switcher lives in Profile settings (signed-in only) at this stage.
// A legacy/unsupported preferred_language value (the DB still allow-lists
// fr/de/zh from the original schema) also falls back to English rather
// than a missing dictionary.
export const getLocale = cache(async (): Promise<Locale> => {
  const { user } = await getAuthedUser();
  if (!user) {
    return "en";
  }

  const profile = await getProfile(user.id);
  return profile?.preferred_language === "sw" ? "sw" : "en";
});
