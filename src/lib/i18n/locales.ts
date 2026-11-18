// Every language The Leap supports or plans to. A language is only offered
// to users once it has a dictionary in ./dictionaries.ts (see
// isEnabledLocale) — listing it here alone doesn't switch it on, so a
// half-translated language never reaches the live app.

export const LOCALES = ["en", "sw", "de", "fr", "es", "zh-CN"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export type LocaleInfo = {
  /** Shown in the language picker: always in the language itself. */
  nativeName: string;
  /** Used when talking to the AI (Companion, translation) about the language. */
  englishName: string;
  dir: "ltr" | "rtl";
};

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { nativeName: "English", englishName: "English", dir: "ltr" },
  sw: { nativeName: "Kiswahili", englishName: "Swahili", dir: "ltr" },
  de: { nativeName: "Deutsch", englishName: "German", dir: "ltr" },
  fr: { nativeName: "Français", englishName: "French", dir: "ltr" },
  es: { nativeName: "Español", englishName: "Spanish", dir: "ltr" },
  "zh-CN": { nativeName: "简体中文", englishName: "Simplified Chinese", dir: "ltr" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Cookie holding the language chosen on this device (signed in or not). */
export const LOCALE_COOKIE = "leap_locale";
