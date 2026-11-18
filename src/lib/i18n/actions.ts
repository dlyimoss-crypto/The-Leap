"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAuthedUser } from "@/lib/supabase/authorize";
import { isEnabledLocale } from "./dictionaries";
import { LOCALE_COOKIE, isLocale } from "./locales";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Saves a language choice from any picker (welcome screen, sign-in,
 * Profile, the one-time suggestion). Always stored on this device, so it
 * survives signing out; for a signed-in user also on their profile, so it
 * follows them to every device.
 */
export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");
  if (!isLocale(locale) || !isEnabledLocale(locale)) {
    return;
  }

  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });

  const { supabase, user } = await getAuthedUser();
  if (user) {
    const { error } = await supabase
      .from("profiles")
      .update({ preferred_language: locale })
      .eq("id", user.id);
    if (error) {
      console.error("Failed to update preferred language", error);
    }
  }

  // Locale affects every route's chrome (nav, dashboard, companion, etc.),
  // not just the current page.
  revalidatePath("/", "layout");
}
