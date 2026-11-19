import path from "node:path";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";
import { safeReadJson } from "./safe-read-json";

const PROMPTS_ROOT = path.join(process.cwd(), "content", "community-prompts");
const VALID_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type CommunityPrompt = { prompt: string; servedLocale: Locale };

// English prompts sit at the root (`<date>.json`); other languages in
// `<locale>/<date>.json`. A missing translation falls back to English.
function readPrompt(date: string, locale: Locale): string | null {
  const entry = safeReadJson<{ prompt: string }>(
    PROMPTS_ROOT,
    VALID_DATE,
    date,
    (d) => (locale === DEFAULT_LOCALE ? `${d}.json` : `${locale}/${d}.json`),
  );
  return entry?.prompt ?? null;
}

export function getCommunityPrompt(
  date: string,
  locale: Locale = DEFAULT_LOCALE,
): CommunityPrompt | null {
  if (locale !== DEFAULT_LOCALE) {
    const translated = readPrompt(date, locale);
    if (translated) return { prompt: translated, servedLocale: locale };
  }
  const english = readPrompt(date, DEFAULT_LOCALE);
  return english ? { prompt: english, servedLocale: DEFAULT_LOCALE } : null;
}
