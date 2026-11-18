import { cache } from "react";
import { cookies, headers } from "next/headers";
import { getAuthedUser, getProfile } from "@/lib/supabase/authorize";
import { ENABLED_LOCALES, isEnabledLocale } from "./dictionaries";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./locales";
import { localeFromAcceptLanguage } from "./negotiate";

/**
 * The language to render in, in priority order:
 * 1. a signed-in user's profile (so it follows them across devices),
 * 2. the language chosen on this device (the leap_locale cookie),
 * 3. English.
 * The device's own language is deliberately *not* applied silently — it's
 * only offered, via getSuggestedLocale. A stored value whose dictionary
 * doesn't exist yet also falls back to English.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  const { user } = await getAuthedUser();
  if (user) {
    const profile = await getProfile(user.id);
    const stored = profile?.preferred_language;
    return isLocale(stored) && isEnabledLocale(stored) ? stored : DEFAULT_LOCALE;
  }

  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(cookie) && isEnabledLocale(cookie) ? cookie : DEFAULT_LOCALE;
});

/**
 * A language to offer this device, or null. Offered once: making any
 * choice (accepting, declining, or using a picker) sets the cookie, which
 * stops the offer on this device.
 */
export const getSuggestedLocale = cache(async (): Promise<Locale | null> => {
  if ((await cookies()).has(LOCALE_COOKIE)) return null;

  const device = localeFromAcceptLanguage(
    (await headers()).get("accept-language"),
    ENABLED_LOCALES,
  );
  return device && device !== (await getLocale()) ? device : null;
});
